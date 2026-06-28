import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { absoluteUrl, siteConfig } from "../site.config";

export async function GET() {
  const articles = (await getCollection("articles", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: absoluteUrl(),
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: absoluteUrl(`articles/${article.id}/`)
    }))
  });
}
