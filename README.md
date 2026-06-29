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
