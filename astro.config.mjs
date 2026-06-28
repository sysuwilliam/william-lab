import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const repoName = "william-lab";
const base = `/${repoName}`;

function rehypeBaseImages() {
  return (tree) => {
    const visit = (node) => {
      if (node?.type === "element" && node.tagName === "img" && node.properties?.src?.startsWith("/")) {
        node.properties.src = `${base}${node.properties.src}`;
      }
      if (Array.isArray(node?.children)) {
        for (const child of node.children) visit(child);
      }
    };
    visit(tree);
  };
}

export default defineConfig({
  site: "https://sysuwilliam.github.io",
  base,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeBaseImages]
    }),
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
