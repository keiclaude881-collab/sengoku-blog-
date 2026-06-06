import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(_context: APIContext) {
  const items = (await getCollection("posts"))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map(post => ({
      title:       post.data.title,
      description: post.data.description,
      tags:        post.data.tags ?? [],
      category:    post.data.category,
      slug:        `/blog/${post.id.replace(/\.mdx?$/, "")}/`,
    }));

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}
