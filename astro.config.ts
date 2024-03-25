import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import {loadEnv} from "vite";

const {SITE_URL} = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      // todo: es2021
      target: "es2021",
    },
  },
  site: SITE_URL,
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap({}),
    solidJs(),
  ],
  output: "hybrid",
  adapter: cloudflare({
    mode: "directory",
    routes: {
      strategy: "auto",
      include: ["/serverless/*"],
    },
    runtime: {
      mode: "local",
      type: "pages",
    },
  }),
});
