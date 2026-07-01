import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const projectsRoot = path.join(root, "src", "content", "projects");
const owner = "sysuwilliam";
const today = new Date().toISOString().slice(0, 10);

const projects = [
  {
    slug: "ra4m2-sensor",
    title: "RA4M2-SENSOR",
    description: "RA4M2-SENSOR 开发板资料、示例工程和 Zephyr RTOS 开发报告。",
    date: "2026-06-29",
    tags: ["embedded", "ra4m2", "zephyr"],
    repoName: "RA4M2-SENSOR",
    status: "active",
    stack: ["C", "Zephyr", "Renesas FSP", "Markdown"],
    intro: "整理 RA4M2-SENSOR 的开箱记录、开发环境、RA 工程调试注意事项和 Zephyr 双工程实践。这个仓库用于保存可公开的板卡资料、报告和示例工程。"
  },
  {
    slug: "frdm-mcx",
    title: "FRDM-MCX",
    description: "FRDM-MCXN947 相关的嵌入式实验、温湿度链路和蓝牙通信记录。",
    date: "2026-06-28",
    tags: ["embedded", "frdm", "ble"],
    repoName: "FRDM-MCX",
    status: "active",
    stack: ["C", "Zephyr", "ESP-IDF", "BLE"],
    intro: "项目重点记录 FRDM-MCXN947 到 ESP32-S3 再到微信小程序的温湿度数据链路，包括 UART 协议、BLE 广播和移动端解析流程。"
  },
  {
    slug: "william-lab",
    title: "William Lab",
    description: "当前个人网站源码，用于公开文章、项目和工程资源。",
    date: "2026-06-28",
    tags: ["website", "astro", "github-pages"],
    repoName: "william-lab",
    homepage: "https://sysuwilliam.github.io/william-lab/",
    status: "active",
    stack: ["Astro", "TypeScript", "Markdown", "GitHub Actions"],
    intro: "一个静态个人技术主页，使用 Astro 内容集合组织文章、项目和资源，并通过 GitHub Pages 免费部署。"
  },
  {
    slug: "arduino-uno-q-4gb",
    title: "arduino-UNO-Q-4GB",
    description: "Arduino UNO Q 4GB 的系统体验、SBC 模式、视觉服务和 AI 部署报告。",
    date: "2026-06-17",
    tags: ["arduino", "linux", "opencv"],
    repoName: "arduino-UNO-Q-4GB",
    status: "active",
    stack: ["Linux", "Debian", "OpenCV", "Python", "HTML"],
    intro: "仓库沉淀 Arduino UNO Q 4GB 的开发报告，包括 Ubuntu/Debian 使用、Codex CLI 部署、OpenCV 摄像头服务、矩形识别和自定义 AI 模型部署。"
  },
  {
    slug: "nc-current-source",
    title: "NC-Current-Source",
    description: "高精度数控恒流源项目代码和说明。",
    date: "2026-06-14",
    tags: ["electronics", "embedded", "current-source"],
    repoName: "NC-Current-Source",
    status: "active",
    stack: ["C", "STM32", "HMI", "Control"],
    team: true,
    role: "团队项目",
    intro: "面向电子设计竞赛场景的高精度数控恒流源工程，包含嵌入式控制、显示交互和工程文档。该项目作为团队项目单独展示。"
  },
  {
    slug: "venom-vnv",
    title: "Venom_VNV",
    description: "中山大学机器人队 Venom 项目总仓库与导航可视化教程入口。",
    date: "2026-06-10",
    tags: ["team", "robotics", "visualization", "navigation"],
    repoName: "Venom_VNV",
    homepage: "https://venom-algorithm.github.io/Venom_VNV/",
    status: "active",
    stack: ["Markdown", "GitHub Pages", "Robotics", "Visualization"],
    team: true,
    role: "中山大学机器人队项目",
    intro: "中山大学机器人队 Venom 项目总仓库，集中承载导航可视化、文档入口和项目教程。详细使用教程见项目站点。"
  },
  {
    slug: "yolo-learn",
    title: "YOLO-LEARN",
    description: "YOLO 目标检测学习、训练和部署实验记录。",
    date: "2026-06-10",
    tags: ["vision", "yolo", "python"],
    repoName: "YOLO-LEARN",
    status: "learning",
    stack: ["Python", "YOLO", "Computer Vision"],
    intro: "用于记录 YOLO 目标检测相关的学习过程、数据处理、训练实验和部署尝试。"
  },
  {
    slug: "arduino-apps",
    title: "Arduino-Apps",
    description: "Arduino 相关应用、页面和小工具实验集合。",
    date: "2026-05-30",
    tags: ["arduino", "apps", "frontend"],
    repoName: "Arduino-Apps",
    status: "learning",
    stack: ["CSS", "HTML", "Arduino"],
    intro: "用于收集 Arduino 相关的应用界面、小工具和前端展示实验。"
  },
  {
    slug: "ros2-learn",
    title: "ROS2-learn",
    description: "ROS 2 机器人开发学习、环境配置和实验记录。",
    date: "2026-07-01",
    tags: ["ros2", "robotics", "linux", "learning"],
    repoName: "ROS2-learn",
    status: "learning",
    stack: ["ROS 2", "Linux", "Robotics", "C++", "Python"],
    intro: "ROS 2 机器人开发学习仓库，用于整理环境配置、基础通信机制、节点实验和后续机器人项目实践。"
  },
  {
    slug: "leetcode-study",
    title: "LeetCode_study",
    description: "算法题训练和 Python 解题记录。",
    date: "2026-05-20",
    tags: ["private", "algorithm", "python"],
    repo: "https://github.com/sysuwilliam",
    status: "learning",
    stack: ["Python", "Algorithms", "Data Structures"],
    private: true,
    intro: "私有刷题仓库，仅公开项目方向与技术栈，不公开源码链接。"
  },
  {
    slug: "micro-bit",
    title: "micro-bit",
    description: "micro:bit 相关实验和 Python 编程练习仓库。",
    date: "2026-05-30",
    tags: ["private", "microbit", "python"],
    repo: "https://github.com/sysuwilliam",
    status: "learning",
    stack: ["Python", "micro:bit", "Embedded"],
    private: true,
    intro: "私有实验仓库，仅公开项目方向与技术栈，不公开源码链接。"
  },
  {
    slug: "review",
    title: "Review",
    description: "课程复习、数学推导和阶段性学习材料整理。",
    date: "2026-05-10",
    tags: ["private", "review", "notes"],
    repo: "https://github.com/sysuwilliam",
    status: "learning",
    stack: ["Notes", "Math", "Markdown"],
    private: true,
    intro: "私有复习资料仓库，仅公开项目方向与技术栈，不公开内容链接。"
  },
  {
    slug: "ysyx",
    title: "ysyx",
    description: "一生一芯相关学习仓库，记录计算机系统、C 语言和底层工程实践。",
    date: "2026-06-10",
    tags: ["private", "systems", "C"],
    repo: "https://github.com/sysuwilliam",
    status: "learning",
    stack: ["C", "Computer Systems", "RISC-V"],
    private: true,
    intro: "私有学习仓库，仅公开项目方向与技术栈，不公开源码链接。"
  }
];

const yamlString = (value) => JSON.stringify(value ?? "");
const yamlArray = (values) => `[${values.map((value) => yamlString(value)).join(", ")}]`;
const repoUrl = (project) => project.repo ?? `https://github.com/${owner}/${project.repoName}`;

function frontmatter(project) {
  const rows = [
    "---",
    `title: ${yamlString(project.title)}`,
    `description: ${yamlString(project.description)}`,
    `date: ${project.date}`,
    `tags: ${yamlArray(project.tags ?? [])}`,
    "draft: false",
    `repo: ${yamlString(repoUrl(project))}`
  ];
  if (project.homepage) rows.push(`homepage: ${yamlString(project.homepage)}`);
  rows.push(`status: ${yamlString(project.status)}`);
  rows.push(`stack: ${yamlArray(project.stack ?? [])}`);
  if (project.team) rows.push("team: true");
  if (project.private) rows.push("private: true");
  if (project.role) rows.push(`role: ${yamlString(project.role)}`);
  rows.push("---", "");
  return rows.join("\n");
}

async function withRetry(task, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 900));
      }
    }
  }
  throw lastError;
}

async function fetchJson(url) {
  return withRetry(async () => {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "william-lab-project-sync"
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  });
}

async function fetchText(url) {
  return withRetry(async () => {
    const response = await fetch(url, {
      headers: { "User-Agent": "william-lab-project-sync" }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.text();
  });
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "").trim();
}

function encodePathPreservingSlashes(value) {
  return value
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function resolveRelativeUrl(url, basePath = "") {
  const clean = url.replace(/^<|>$/g, "").split("?")[0].replace(/\\/g, "/");
  if (/^(?:https?:|mailto:|tel:|#)/i.test(clean)) return url;
  if (clean.startsWith("/")) return clean.replace(/^\/+/, "");
  return path.posix.normalize(path.posix.join(basePath, clean.replace(/^\.\//, "")));
}

function rewriteReadme(markdown, readme, project) {
  const basePath = path.posix.dirname(readme.path) === "." ? "" : path.posix.dirname(readme.path);
  const branch = readme.branch;
  const rawBase = `https://raw.githubusercontent.com/${owner}/${project.repoName}/${branch}`;
  const blobBase = `https://github.com/${owner}/${project.repoName}/blob/${branch}`;
  let next = stripFrontmatter(markdown);

  next = next.replace(/!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (full, alt, url, title = "") => {
    if (/^(?:https?:|data:|#)/i.test(url)) return full;
    const resolved = resolveRelativeUrl(url, basePath);
    return `![${alt}](${rawBase}/${encodePathPreservingSlashes(resolved)}${title})`;
  });

  next = next.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (full, prefix, url, suffix) => {
    if (/^(?:https?:|data:|#)/i.test(url)) return full;
    const resolved = resolveRelativeUrl(url, basePath);
    return `${prefix}${rawBase}/${encodePathPreservingSlashes(resolved)}${suffix}`;
  });

  next = next.replace(/(<a\b[^>]*\bhref=["'])([^"']+)(["'][^>]*>)/gi, (full, prefix, url, suffix) => {
    if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) return full;
    const resolved = resolveRelativeUrl(url, basePath);
    return `${prefix}${blobBase}/${encodePathPreservingSlashes(resolved)}${suffix}`;
  });

  next = next.replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (full, label, url, title = "") => {
    if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) return full;
    const resolved = resolveRelativeUrl(url, basePath);
    return `[${label}](${blobBase}/${encodePathPreservingSlashes(resolved)}${title})`;
  });

  return next.trim();
}

async function loadReadme(project) {
  if (project.private || !project.repoName) return null;
  try {
    const repo = await fetchJson(`https://api.github.com/repos/${owner}/${project.repoName}`);
    const readme = await fetchJson(`https://api.github.com/repos/${owner}/${project.repoName}/readme`);
    let markdown;
    try {
      markdown = await fetchText(readme.download_url);
    } catch {
      markdown = Buffer.from(readme.content.replace(/\s/g, ""), "base64").toString("utf8");
    }
    return {
      path: readme.path,
      htmlUrl: readme.html_url,
      branch: repo.default_branch,
      body: rewriteReadme(markdown, { path: readme.path, branch: repo.default_branch }, project)
    };
  } catch (error) {
    return { error: String(error.message ?? error) };
  }
}

function linksBlock(project) {
  if (project.private) {
    return "## Project Notes\n\n该项目为私有仓库，当前页面只公开方向、状态和技术栈，不放出源码链接。";
  }
  const links = [`- [GitHub repository](${repoUrl(project)})`];
  if (project.homepage) links.push(`- [Project site / tutorial](${project.homepage})`);
  return `## Links\n\n${links.join("\n")}`;
}

function readmeBlock(project, readme) {
  if (project.private) return "";
  if (!readme?.body) {
    return [
      "## Repository README",
      "",
      "当前没有从公开 GitHub 仓库读取到 README。仓库公开 README 后，运行 `npm run sync:projects` 即可同步到这里。"
    ].join("\n");
  }
  return [
    "## Repository README",
    "",
    `> Synced from [${readme.path}](${readme.htmlUrl}) on ${today}.`,
    "",
    readme.body
  ].join("\n");
}

await fs.mkdir(projectsRoot, { recursive: true });

const results = [];
for (const project of projects) {
  const readme = await loadReadme(project);
  const body = [
    frontmatter(project),
    project.intro,
    "",
    linksBlock(project),
    "",
    readmeBlock(project, readme)
  ].join("\n").trimEnd() + "\n";
  await fs.writeFile(path.join(projectsRoot, `${project.slug}.md`), body, "utf8");
  results.push({
    slug: project.slug,
    private: Boolean(project.private),
    team: Boolean(project.team),
    readme: readme?.body ? "synced" : readme?.error ? `missing: ${readme.error}` : "skipped"
  });
}

console.log(JSON.stringify(results, null, 2));
