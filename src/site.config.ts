export const siteConfig = {
  name: "William Lab",
  title: "William Lab",
  description: "A compact engineering notebook for board bring-up, embedded links, vision deployment, and GitHub projects.",
  site: "https://sysuwilliam.github.io",
  base: "/william-lab/",
  repository: "https://github.com/sysuwilliam/william-lab",
  githubUser: "sysuwilliam",
  goatCounterCode: "william-lab",
  goatCounterPath: "TOTAL",
  latestCommit: "main"
};

export const withSiteBase = (path: string) => {
  const base = siteConfig.base.endsWith("/") ? siteConfig.base : `${siteConfig.base}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
};

export const absoluteUrl = (path = "") => {
  const site = siteConfig.site.replace(/\/$/, "");
  return `${site}${withSiteBase(path)}`;
};
