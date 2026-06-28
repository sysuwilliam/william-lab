import { getCollection } from "astro:content";
import { absoluteUrl } from "../site.config";

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const [articles, projects] = await Promise.all([
    getCollection("articles", ({ data }) => !data.draft),
    getCollection("projects", ({ data }) => !data.draft)
  ]);

  const series = [...new Set(articles.filter((article) => article.data.series).map((article) => article.id.split("/")[0]))];
  const paths = [
    "",
    "articles/",
    "projects/",
    "resources/",
    "about/",
    ...series.map((slug) => `articles/series/${slug}/`),
    ...articles.map((article) => `articles/${article.id}/`),
    ...projects.map((project) => `projects/${project.id}/`)
  ];

  const body = paths
    .map((path) => `  <url><loc>${xmlEscape(absoluteUrl(path))}</loc></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
