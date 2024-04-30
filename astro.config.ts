import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import {loadEnv} from "vite";
import {visualizer} from "rollup-plugin-visualizer";

const {SITE_URL} = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      // todo: es2021
      target: "es2021",
    },
    ssr: {
      noExternal: ["path-to-regexp"],
    },
    plugins: [
      visualizer({
        template: "treemap", // or sunburst
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "analyse.html", // will be saved in project's root
      }),
    ],
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
    runtime: {
      mode: "local",
      type: "pages",
    },
  }),
});
