import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "偉人ラボ",
    description: "偉人の思考で現代のお金と仕事を攻略する。孫子・ナポレオン・マルクス・アウレリウス——時代を超えた知恵を投資・副業・キャリアに応用する。",
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.mdx?$/, "")}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
