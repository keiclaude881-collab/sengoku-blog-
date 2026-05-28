import { defineCollection, z } from "astro:content";

const articleSchema = z.object({
  title:       z.string(),
  date:        z.coerce.date(),
  updatedAt:   z.coerce.date().optional(),
  category:    z.enum(["decide", "lead", "recover", "strategy", "change", "philosophy"]),
  tags:        z.array(z.string()).default([]),
  description: z.string().max(120),
  ogImage:     z.string().optional(),
  year:        z.number().optional(),
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
    reason:     z.string(),
    image:      z.string().optional(),
  })).optional(),
});

export const collections = {
  whatif:     defineCollection({ type: "content", schema: articleSchema }),
  philosophy: defineCollection({ type: "content", schema: articleSchema }),
};
