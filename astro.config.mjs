import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const repoName = "william-lab";

export default defineConfig({
  site: "https://sysuwilliam.github.io",
  base: `/${repoName}`,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }),
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
