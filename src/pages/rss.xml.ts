import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const collections = await Promise.all([
    getCollection("battle"),
    getCollection("leader"),
    getCollection("strategy"),
    getCollection("books"),
    getCollection("movie"),
    getCollection("whatif"),
    getCollection("anime"),
    getCollection("business"),
    getCollection("sports"),
  ]);

  const allPosts = collections
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "決断の系譜",
    description: "歴史の転換点から学ぶ戦略思考。合戦・リーダー・戦略・歴史のIFを現代ビジネスに繋げる。",
    site: context.site!,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.mdx?$/, "")}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
