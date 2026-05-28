import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const collections = await Promise.all([
    getCollection("whatif").catch(() => []),
    
    getCollection("philosophy").catch(() => []),
  ]);

  const allPosts = collections
    .flat()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "偉人ラボ",
    description: "歴史の偉人が現代の問題を解決する。信長・ナポレオン・孫子・龍馬——偉人たちの知恵を現代語で届ける。",
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
