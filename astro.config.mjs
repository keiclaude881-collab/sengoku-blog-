import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://sengoku-blog.vercel.app",
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
