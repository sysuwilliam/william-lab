import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false)
});

const articleCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: baseEntrySchema
});

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: baseEntrySchema.extend({
    repo: z.url(),
    homepage: z.url().optional(),
    status: z.enum(["active", "archived", "learning"]),
    stack: z.array(z.string()).default([])
  })
});

const resourceCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: baseEntrySchema.extend({
    kind: z.enum(["file", "link", "repo", "note"]),
    url: z.string(),
    size: z.string().optional()
  })
});

export const collections = {
  articles: articleCollection,
  projects: projectCollection,
  resources: resourceCollection
};
