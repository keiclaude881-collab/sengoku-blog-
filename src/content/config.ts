import { defineCollection, z } from "astro:content";

const postSchema = z.object({
  title:       z.string(),
  date:        z.coerce.date(),
  updatedAt:   z.coerce.date().optional(),
  category:    z.enum(["money", "career", "mindset"]),
  tags:        z.array(z.string()).default([]),
  description: z.string().max(160),
  ogImage:     z.string().optional(),
  readingTime: z.number(),
  featured:    z.boolean().default(false),
  affiliateBooks: z.array(z.object({
    title:  z.string(),
    asin:   z.string().optional(),
    reason: z.string(),
    image:  z.string().optional(),
  })).optional(),
});

export const collections = {
  posts: defineCollection({ type: "content", schema: postSchema }),
};
