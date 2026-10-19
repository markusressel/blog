import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/*.md',
      schema: z.object({
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        img: z.string().optional(),
        alt: z.string().optional(),
        authors: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        // placeholder articles, only visible in development
        dummy: z.boolean().default(false),
        // minutes, computed at build time (`content:file:afterParse` in nuxt.config.ts)
        readingTime: z.number().optional(),
      }),
    }),
    authors: defineCollection({
      type: 'data',
      source: 'authors/*.md',
      schema: z.object({
        name: z.string(),
        bio: z.string().optional(),
        cite: z.string().optional(),
        jobtitle: z.string().optional(),
        country: z.string().optional(),
        image: z.string().optional(),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
    }),
  },
})
