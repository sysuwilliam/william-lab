import fs from "node:fs/promises";
import path from "node:path";

const websiteRoot = process.cwd();
const articlesRoot = path.join(websiteRoot, "src", "content", "articles");
const projectsRoot = path.join(websiteRoot, "src", "content", "projects");
const raRoot = "D:\\IEEE Project\\评测\\RA4M2-SENSOR";
const raReportRoot = path.join(raRoot, "报告");

const seriesMeta = {
  "arduino-uno-q-4gb": {
    title: "Arduino UNO Q 4GB",
    board: "Arduino UNO Q 4GB",
    description: "围绕 Arduino UNO Q 4GB 的系统启动、SBC 模式、Debian 环境、OpenCV 服务和 AI 识别部署记录。",
    tags: ["Arduino", "Linux", "OpenCV", "AI"],
    dateBase: "2026-06"
  },
  "frdm-mcxn947": {
    title: "FRDM-MCXN947",
    board: "FRDM-MCXN947",
    description: "FRDM-MCXN947、ESP32-S3 与微信小程序之间的温湿度蓝牙链路开发记录。",
    tags: ["FRDM", "BLE", "ESP32", "Zephyr"],
    dateBase: "2026-06"
  },
  "ra4m2-sensor": {
    title: "RA4M2-SENSOR",
    board: "RA4M2-SENSOR",
    description: "RA4M2-SENSOR 开箱、FSP/VS Code 环境、RA 调试事项与 Zephyr RTOS 双工程开发记录。",
    tags: ["RA4M2", "Renesas", "Zephyr", "RTOS"],
    dateBase: "2026-06"
  }
};

const projectData = [
  {
    slug: "ra4m2-sensor",
    title: "RA4M2-SENSOR",
    description: "RA4M2-SENSOR 开发板资料、示例工程和 Zephyr RTOS 开发报告。",
    date: "2026-06-29",
    tags: ["embedded", "ra4m2", "zephyr"],
    repo: "https://github.com/sysuwilliam/RA4M2-SENSOR",
    status: "active",
    stack: ["C", "Zephyr", "Renesas FSP", "Markdown"],
    body: "整理 RA4M2-SENSOR 的开箱记录、开发环境、RA 工程调试注意事项和 Zephyr 双工程实践。这个仓库用于保存可公开的板卡资料、报告和示例工程。"
  },
  {
    slug: "frdm-mcx",
    title: "FRDM-MCX",
    description: "FRDM-MCXN947 相关的嵌入式实验、温湿度链路和蓝牙通信记录。",
    date: "2026-06-28",
    tags: ["embedded", "frdm", "ble"],
    repo: "https://github.com/sysuwilliam/FRDM-MCX",
    status: "active",
    stack: ["C", "Zephyr", "ESP-IDF", "BLE"],
    body: "项目重点记录 FRDM-MCXN947 到 ESP32-S3 再到微信小程序的温湿度数据链路，包括 UART 协议、BLE 广播和移动端解析流程。"
  },
  {
    slug: "william-lab",
    title: "William Lab",
    description: "当前个人网站源码，用于公开文章、项目和工程资源。",
    date: "2026-06-28",
    tags: ["website", "astro", "github-pages"],
    repo: "https://github.com/sysuwilliam/william-lab",
    homepage: "https://sysuwilliam.github.io/william-lab/",
    status: "active",
    stack: ["Astro", "TypeScript", "Markdown", "GitHub Actions"],
    body: "一个静态个人技术主页，使用 Astro 内容集合组织文章、项目和资源，并通过 GitHub Pages 免费部署。"
  },
  {
    slug: "arduino-uno-q-4gb",
    title: "arduino-UNO-Q-4GB",
    description: "Arduino UNO Q 4GB 的系统体验、SBC 模式、视觉服务和 AI 部署报告。",
    date: "2026-06-17",
    tags: ["arduino", "linux", "opencv"],
    repo: "https://github.com/sysuwilliam/arduino-UNO-Q-4GB",
    status: "active",
    stack: ["Linux", "Debian", "OpenCV", "Python", "HTML"],
    body: "仓库沉淀 Arduino UNO Q 4GB 的开发报告，包括 Ubuntu/Debian 使用、Codex CLI 部署、OpenCV 摄像头服务、矩形识别和自定义 AI 模型部署。"
  },
  {
    slug: "nc-current-source",
    title: "NC-Current-Source",
    description: "高精度数控恒流源项目代码和说明。",
    date: "2026-06-14",
    tags: ["electronics", "embedded", "current-source"],
    repo: "https://github.com/sysuwilliam/NC-Current-Source",
    status: "active",
    stack: ["C", "STM32", "HMI", "Control"],
    team: true,
    role: "团队项目",
    body: "面向电子设计竞赛场景的高精度数控恒流源工程，包含嵌入式控制、显示交互和工程文档。该项目作为团队项目单独展示。"
  },
  {
    slug: "yolo-learn",
    title: "YOLO-LEARN",
    description: "YOLO 目标检测学习、训练和部署实验记录。",
    date: "2026-06-10",
    tags: ["vision", "yolo", "python"],
    repo: "https://github.com/sysuwilliam/YOLO-LEARN",
    status: "learning",
    stack: ["Python", "YOLO", "Computer Vision"],
    body: "用于记录 YOLO 目标检测相关的学习过程、数据处理、训练实验和部署尝试。"
  },
  {
    slug: "venom-vnv",
    title: "Venom_VNV",
    description: "Venom navigation visualization 相关页面和可视化实验。",
    date: "2026-06-10",
    tags: ["visualization", "navigation"],
    repo: "https://github.com/sysuwilliam/Venom_VNV",
    homepage: "https://sysuwilliam.github.io/Venom_VNV/",
    status: "active",
    stack: ["Markdown", "GitHub Pages", "Visualization"],
    body: "一个导航可视化和项目展示方向的仓库，也是当前个人网站设计时参考过的公开页面之一。"
  },
  {
    slug: "arduino-apps",
    title: "Arduino-Apps",
    description: "Arduino 相关应用、页面和小工具实验集合。",
    date: "2026-05-30",
    tags: ["arduino", "apps", "frontend"],
    repo: "https://github.com/sysuwilliam/Arduino-Apps",
    status: "learning",
    stack: ["CSS", "HTML", "Arduino"],
    body: "用于收集 Arduino 相关的应用界面、小工具和前端展示实验。"
  }
];

const arduinoFiles = [
  "1.开发板介绍.md",
  "2.使用Ubuntu系统运行开发版.md",
  "3.使用SBC模式运行Debian并部署Codex CLI.md",
  "4.基于SBC模式的开发板环境优化.md",
  "5.在Debian主机上部署OpenCV摄像头服务.md",
  "6.基于OpenCV的矩形识别与Web可视化项目.md",
  "7.自定义AI识别模型训练与部署.md"
];

function slugifyFilename(name) {
  return name
    .replace(/\.md$/i, "")
    .replace(/^\d+[.．、_-]?\s*/, "")
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function titleFromFilename(name) {
  return name.replace(/\.md$/i, "").replace(/^\d+[.．、_-]?\s*/, "").trim();
}

function orderFromFilename(name, fallback) {
  const match = name.match(/^(\d+)/);
  return match ? Number(match[1]) : fallback;
}

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function yamlArray(values) {
  return `[${values.map((value) => yamlString(value)).join(", ")}]`;
}

function frontmatter(data) {
  const rows = [
    "---",
    `title: ${yamlString(data.title)}`,
    `description: ${yamlString(data.description)}`,
    `date: ${data.date}`,
    `tags: ${yamlArray(data.tags ?? [])}`,
    `draft: false`
  ];
  if (data.series) rows.push(`series: ${yamlString(data.series)}`);
  if (data.board) rows.push(`board: ${yamlString(data.board)}`);
  if (data.sourceUrl) rows.push(`sourceUrl: ${yamlString(data.sourceUrl)}`);
  if (data.order !== undefined) rows.push(`order: ${data.order}`);
  rows.push("---", "");
  return rows.join("\n");
}

function projectFrontmatter(data) {
  const rows = [
    "---",
    `title: ${yamlString(data.title)}`,
    `description: ${yamlString(data.description)}`,
    `date: ${data.date}`,
    `tags: ${yamlArray(data.tags ?? [])}`,
    `draft: false`,
    `repo: ${yamlString(data.repo)}`
  ];
  if (data.homepage) rows.push(`homepage: ${yamlString(data.homepage)}`);
  rows.push(`status: ${yamlString(data.status)}`);
  rows.push(`stack: ${yamlArray(data.stack ?? [])}`);
  if (data.team) rows.push(`team: true`);
  if (data.role) rows.push(`role: ${yamlString(data.role)}`);
  rows.push("---", "");
  return rows.join("\n");
}

function removeExistingFrontmatter(content) {
  return content.replace(/^---\s*[\s\S]*?\s*---\s*/, "");
}

function descriptionFromMarkdown(content, fallback) {
  const cleaned = removeExistingFrontmatter(content)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("!") && !line.startsWith("|"));
  const first = cleaned.find((line) => !/^[-*+]/.test(line)) ?? fallback;
  return first.replace(/[`*_>#\[\]]/g, "").slice(0, 110);
}

function rewriteGithubImages(content, rawBase) {
  return content.replace(/(!\[[^\]]*\]\()((?!https?:\/\/|\/|#)[^)]+)(\))/g, (_, start, url, end) => {
    const clean = url.replace(/^\.\//, "").split("?")[0];
    return `${start}${rawBase}/${encodeURI(clean).replace(/#/g, "%23")}${end}`;
  });
}

function rewriteLocalImages(content, assetBase) {
  return content.replace(/(!\[[^\]]*\]\()((?!https?:\/\/|\/|#)[^)]+)(\))/g, (_, start, url, end) => {
    const clean = url.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "").replace(/\\/g, "/");
    return `${start}${assetBase}/${encodeURI(clean).replace(/#/g, "%23")}${end}`;
  });
}

async function resetGeneratedContent() {
  await fs.rm(path.join(articlesRoot, "arduino-uno-q-4gb"), { recursive: true, force: true });
  await fs.rm(path.join(articlesRoot, "frdm-mcxn947"), { recursive: true, force: true });
  await fs.rm(path.join(articlesRoot, "ra4m2-sensor"), { recursive: true, force: true });
  await fs.rm(projectsRoot, { recursive: true, force: true });
  await fs.mkdir(projectsRoot, { recursive: true });
}

async function fetchText(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "william-lab-content-import" } });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
      }
    }
  }
  throw lastError;
}

async function importArduino() {
  const series = seriesMeta["arduino-uno-q-4gb"];
  const outDir = path.join(articlesRoot, "arduino-uno-q-4gb");
  await fs.mkdir(outDir, { recursive: true });
  const rawBase = "https://raw.githubusercontent.com/sysuwilliam/arduino-UNO-Q-4GB/main/%E5%BC%80%E5%8F%91%E6%8A%A5%E5%91%8A";
  const sourceBase = "https://github.com/sysuwilliam/arduino-UNO-Q-4GB/blob/main/%E5%BC%80%E5%8F%91%E6%8A%A5%E5%91%8A";

  for (const [index, file] of arduinoFiles.entries()) {
    const order = orderFromFilename(file, index + 1);
    const rawUrl = `${rawBase}/${encodeURIComponent(file)}`;
    const sourceUrl = `${sourceBase}/${encodeURIComponent(file)}`;
    const markdown = await fetchText(rawUrl);
    const title = titleFromFilename(file);
    const body = rewriteGithubImages(removeExistingFrontmatter(markdown), rawBase);
    const data = {
      title,
      description: descriptionFromMarkdown(body, `${series.board} 开发报告：${title}`),
      date: `${series.dateBase}-${String(Math.min(order, 28)).padStart(2, "0")}`,
      tags: series.tags,
      series: series.title,
      board: series.board,
      sourceUrl,
      order
    };
    await fs.writeFile(path.join(outDir, `${String(order).padStart(2, "0")}-${slugifyFilename(file)}.md`), `${frontmatter(data)}[原始报告](${sourceUrl})\n\n${body.trim()}\n`, "utf8");
  }
}

async function importFrdm() {
  const series = seriesMeta["frdm-mcxn947"];
  const outDir = path.join(articlesRoot, "frdm-mcxn947");
  await fs.mkdir(outDir, { recursive: true });
  const file = "温湿度蓝牙链路开发报告.md";
  const rawBase = "https://raw.githubusercontent.com/sysuwilliam/FRDM-MCX/main/FRDM-MCXN947";
  const sourceUrl = "https://github.com/sysuwilliam/FRDM-MCX/blob/main/FRDM-MCXN947/%E6%B8%A9%E6%B9%BF%E5%BA%A6%E8%93%9D%E7%89%99%E9%93%BE%E8%B7%AF%E5%BC%80%E5%8F%91%E6%8A%A5%E5%91%8A.md";
  const markdown = await fetchText(`${rawBase}/${encodeURIComponent(file)}`);
  const title = titleFromFilename(file);
  const body = rewriteGithubImages(removeExistingFrontmatter(markdown), rawBase);
  const data = {
    title,
    description: descriptionFromMarkdown(body, "FRDM-MCXN947 温湿度蓝牙链路开发记录。"),
    date: "2026-06-16",
    tags: series.tags,
    series: series.title,
    board: series.board,
    sourceUrl,
    order: 1
  };
  await fs.writeFile(path.join(outDir, `01-${slugifyFilename(file)}.md`), `${frontmatter(data)}[原始报告](${sourceUrl})\n\n${body.trim()}\n`, "utf8");
}

async function importRa4m2() {
  const series = seriesMeta["ra4m2-sensor"];
  const outDir = path.join(articlesRoot, "ra4m2-sensor");
  await fs.mkdir(outDir, { recursive: true });
  const rawAssetBase = "https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main/%E6%8A%A5%E5%91%8A";
  const rawRootAssetBase = "https://raw.githubusercontent.com/sysuwilliam/RA4M2-SENSOR/main";
  const files = (await fs.readdir(raReportRoot))
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .sort((a, b) => orderFromFilename(a, 999) - orderFromFilename(b, 999) || a.localeCompare(b, "zh-CN"));

  for (const [index, file] of files.entries()) {
    const order = orderFromFilename(file, index + 1);
    const markdown = await fs.readFile(path.join(raReportRoot, file), "utf8");
    const title = titleFromFilename(file);
    const body = removeExistingFrontmatter(markdown).replace(/(!\[[^\]]*\]\()((?!https?:\/\/|\/|#)[^)]+)(\))/g, (_, start, url, end) => {
      const normalized = url.replace(/^\.\//, "").replace(/\\/g, "/");
      if (normalized.startsWith("../")) {
        const cleanRoot = normalized.replace(/^(\.\.\/)+/, "");
        return `${start}${rawRootAssetBase}/${encodeURI(cleanRoot).replace(/#/g, "%23")}${end}`;
      }
      return `${start}${rawAssetBase}/${encodeURI(normalized).replace(/#/g, "%23")}${end}`;
    });
    const sourceUrl = `https://github.com/sysuwilliam/RA4M2-SENSOR/blob/main/%E6%8A%A5%E5%91%8A/${encodeURIComponent(file)}`;
    const data = {
      title,
      description: descriptionFromMarkdown(body, `${series.board} 开发报告：${title}`),
      date: `${series.dateBase}-${String(Math.min(order + 18, 28)).padStart(2, "0")}`,
      tags: series.tags,
      series: series.title,
      board: series.board,
      sourceUrl,
      order
    };
    await fs.writeFile(path.join(outDir, `${String(order).padStart(2, "0")}-${slugifyFilename(file)}.md`), `${frontmatter(data)}[原始报告](${sourceUrl})\n\n${body.trim()}\n`, "utf8");
  }
}

async function writeProjects() {
  for (const project of projectData) {
    const body = `${projectFrontmatter(project)}${project.body}\n\n## Links\n\n- [GitHub repository](${project.repo})${project.homepage ? `\n- [Live page](${project.homepage})` : ""}\n`;
    await fs.writeFile(path.join(projectsRoot, `${project.slug}.md`), body, "utf8");
  }
}

await resetGeneratedContent();
await importArduino();
await importFrdm();
await importRa4m2();
await writeProjects();
await import("./sync-project-readmes.mjs");
console.log("Imported board articles and GitHub projects.");
