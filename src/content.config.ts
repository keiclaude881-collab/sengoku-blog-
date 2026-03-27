import { defineCollection, z } from "astro:content";

const articleSchema = z.object({
  title:       z.string(),
  date:        z.coerce.date(),
  updatedAt:   z.coerce.date().optional(),
  category:    z.enum(["battle", "leader", "strategy", "books", "movie", "whatif", "anime", "business", "sports", "novel", "world"]),
  tags:        z.array(z.string()).default([]),
  description: z.string().max(120),
  ogImage:     z.string().optional(),
  readingTime: z.number(),
  featured:    z.boolean().default(false),
  lesson:      z.string().optional(),
  youtubeId:   z.string().optional(),
  vodService:  z.enum(["unext", "hulu", "netflix", "disneyplus", "amazon"]).optional(),
  vodUrl:      z.string().optional(),
  affiliateBooks: z.array(z.object({
    title:      z.string(),
    asin:       z.string().optional(),
    rakutenUrl: z.string().optional(),
    reason:     z.string().max(100),
    image:      z.string().optional(),
  })).optional(),
});

export const collections = {
  battle:   defineCollection({ type: "content", schema: articleSchema }),
  leader:   defineCollection({ type: "content", schema: articleSchema }),
  strategy: defineCollection({ type: "content", schema: articleSchema }),
  books:    defineCollection({ type: "content", schema: articleSchema }),
  movie:    defineCollection({ type: "content", schema: articleSchema }),
  whatif:   defineCollection({ type: "content", schema: articleSchema }),
  anime:    defineCollection({ type: "content", schema: articleSchema }),
  business: defineCollection({ type: "content", schema: articleSchema }),
  sports:   defineCollection({ type: "content", schema: articleSchema }),
  novel:    defineCollection({ type: "content", schema: articleSchema }),
  world:    defineCollection({ type: "content", schema: articleSchema }),
};
