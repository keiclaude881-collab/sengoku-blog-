import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    affiliate: z
      .object({
        title: z.string(),
        url: z.string(),
        image: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts };
