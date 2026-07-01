---
title: "William Lab"
description: "当前个人网站源码，用于公开文章、项目和工程资源。"
date: 2026-06-28
tags: ["website", "astro", "github-pages"]
draft: false
repo: "https://github.com/sysuwilliam/william-lab"
homepage: "https://sysuwilliam.github.io/william-lab/"
status: "active"
stack: ["Astro", "TypeScript", "Markdown", "GitHub Actions"]
---

一个静态个人技术主页，使用 Astro 内容集合组织文章、项目和资源，并通过 GitHub Pages 免费部署。

## Links

- [GitHub repository](https://github.com/sysuwilliam/william-lab)
- [Project site / tutorial](https://sysuwilliam.github.io/william-lab/)

## Repository README

> Synced from [README.md](https://github.com/sysuwilliam/william-lab/blob/main/README.md) on 2026-07-01.

# William Lab

Astro static personal site for articles, GitHub projects, and resource links.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

## Build

```bash
npm run build
```

The generated static site is written to `dist/`.

## Visit Counter

The homepage visit badge uses GoatCounter when `siteConfig.goatCounterCode` is set in `src/site.config.ts`.

- Keep `goatCounterCode` empty to show the local fallback `stats pending`.
- Set `goatCounterCode` to your GoatCounter site code to load the total count.
- In GoatCounter settings, enable visitor counts on your website.

## GitHub Pages

This repository includes `.github/workflows/deploy.yml`.

The project is configured for:

- GitHub user: `sysuwilliam`
- Repository: `william-lab`
- Public URL: `https://sysuwilliam.github.io/william-lab/`

Push the project to GitHub and set Pages source to GitHub Actions.

## Content

- Articles: `src/content/articles/`
- Projects: `src/content/projects/`
- Resources: `src/content/resources/`
- Small downloadable files: `public/resources/`

Large files should be stored outside the Git repository and linked from the Resources page.
