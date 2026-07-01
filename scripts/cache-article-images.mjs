import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "src", "content", "articles");
const projectsDir = path.join(root, "src", "content", "projects");
const publicDir = path.join(root, "public");
const siteBase = "/william-lab";

const imageExtensions = new Set([".apng", ".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);

const contentTypeExtensions = new Map([
  ["image/apng", ".apng"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/svg+xml", ".svg"],
  ["image/webp", ".webp"]
]);

const walk = async (dir) => {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }
  return files;
};

const hashUrl = (url) => createHash("sha1").update(url).digest("hex").slice(0, 12);

const safeName = (value) => {
  const decoded = decodeURIComponent(value).normalize("NFKD");
  const ascii = decoded.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return ascii.slice(0, 72) || "image";
};

const extensionFor = (url, contentType) => {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    if (imageExtensions.has(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  } catch {
    // Fall back to content-type below.
  }
  const type = (contentType ?? "").split(";")[0].trim().toLowerCase();
  return contentTypeExtensions.get(type) ?? ".bin";
};

const contentAssetBase = (file) => {
  const isProject = path.relative(projectsDir, file).startsWith("..") === false;
  const contentDir = isProject ? projectsDir : articlesDir;
  const contentType = isProject ? "projects" : "articles";
  const relative = path.relative(contentDir, file).replace(/\.md$/i, "");
  return relative
    .split(path.sep)
    .map((part) => safeName(part).toLowerCase())
    .reduce((parts, part) => [...parts, part], [contentType])
    .join("/");
};

const localUrlFor = (file, remoteUrl, contentType) => {
  const urlPath = new URL(remoteUrl).pathname;
  const base = safeName(path.basename(urlPath, path.extname(urlPath)));
  const ext = extensionFor(remoteUrl, contentType);
  const articleBase = contentAssetBase(file);
  const fileName = `${base}-${hashUrl(remoteUrl)}${ext}`;
  const publicRelative = path.posix.join("media", articleBase, fileName);
  return {
    diskPath: path.join(publicDir, ...publicRelative.split("/")),
    publicUrl: `/${publicRelative}`
  };
};

const fetchWithRetry = async (url) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "William-Lab image cache"
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
};

const markdownImagePattern = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(\s+"[^"]*")?\)/g;
const htmlImagePattern = /(<img\b[^>]*\bsrc=["'])(https?:\/\/[^"']+)(["'][^>]*>)/gi;
const localHtmlImagePattern = /(<img\b[^>]*\bsrc=["'])\/media\/([^"']+)(["'][^>]*>)/gi;

const files = [
  ...await walk(articlesDir),
  ...await walk(projectsDir)
];
const urlToAsset = new Map();
const failures = [];
let replacements = 0;
let downloads = 0;

const ensureAsset = async (file, remoteUrl) => {
  const key = `${file}\n${remoteUrl}`;
  if (urlToAsset.has(key)) return urlToAsset.get(key);

  const initial = localUrlFor(file, remoteUrl);
  if (existsSync(initial.diskPath)) {
    urlToAsset.set(key, initial.publicUrl);
    return initial.publicUrl;
  }

  try {
    const response = await fetchWithRetry(remoteUrl);
    const contentType = response.headers.get("content-type");
    const asset = localUrlFor(file, remoteUrl, contentType);
    const bytes = new Uint8Array(await response.arrayBuffer());
    await mkdir(path.dirname(asset.diskPath), { recursive: true });
    await writeFile(asset.diskPath, bytes);
    downloads += 1;
    urlToAsset.set(key, asset.publicUrl);
    return asset.publicUrl;
  } catch (error) {
    failures.push({ file: path.relative(root, file), url: remoteUrl, error: String(error) });
    urlToAsset.set(key, remoteUrl);
    return remoteUrl;
  }
};

for (const file of files) {
  const original = await readFile(file, "utf8");
  let next = original;

  const markdownMatches = [...original.matchAll(markdownImagePattern)];
  for (const match of markdownMatches) {
    const [full, alt, remoteUrl, title = ""] = match;
    const localUrl = await ensureAsset(file, remoteUrl);
    if (localUrl !== remoteUrl) {
      next = next.replace(full, `![${alt}](${localUrl}${title})`);
      replacements += 1;
    }
  }

  const htmlMatches = [...original.matchAll(htmlImagePattern)];
  for (const match of htmlMatches) {
    const [full, prefix, remoteUrl, suffix] = match;
    const localUrl = await ensureAsset(file, remoteUrl);
    if (localUrl !== remoteUrl) {
      next = next.replace(full, `${prefix}${siteBase}${localUrl}${suffix}`);
      replacements += 1;
    }
  }

  next = next.replace(localHtmlImagePattern, (_full, prefix, relativePath, suffix) => {
    replacements += 1;
    return `${prefix}${siteBase}/media/${relativePath}${suffix}`;
  });

  if (next !== original) await writeFile(file, next, "utf8");
}

console.log(JSON.stringify({
  files: files.length,
  downloads,
  replacements,
  failures
}, null, 2));

if (failures.length > 0) process.exitCode = 1;
