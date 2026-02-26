import { defineCollection, z } from "astro:content";

const articleSchema = z.object({
  title:       z.string(),
  date:        z.coerce.date(),
  category:    z.enum(["battle", "leader", "strategy", "books"]),
  tags:        z.array(z.string()).default([]),
  description: z.string().max(120),
  ogImage:     z.string().optional(),
  readingTime: z.number(),
  featured:    z.boolean().default(false),
  lesson:      z.string().optional(),
  affiliateBooks: z.array(z.object({
    title:  z.string(),
    asin:   z.string(),
    reason: z.string().max(100),
    image:  z.string().optional(),
  })).optional(),
});

export const collections = {
  battle:   defineCollection({ type: "content", schema: articleSchema }),
  leader:   defineCollection({ type: "content", schema: articleSchema }),
  strategy: defineCollection({ type: "content", schema: articleSchema }),
  books:    defineCollection({ type: "content", schema: articleSchema }),
};
