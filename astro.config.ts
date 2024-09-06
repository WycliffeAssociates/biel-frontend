import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import {loadEnv} from "vite";
import {visualizer} from "rollup-plugin-visualizer";
import AstroPWA from "@vite-pwa/astro";

const {SITE_URL} = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
const isDev = import.meta.env.DEV;

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {},
    resolve: {
      conditions: !isDev ? ["worker", "webworker"] : [],
      mainFields: !isDev ? ["module"] : [],
    },
    ssr: {
      noExternal: [],
      external: ["node:fs", "node:path"],
      // noExternal: ["path-to-regexp"],
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
    AstroPWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      /* your pwa options */
    }),
    UnoCSS({
      injectReset: true,
    }),
    sitemap({}),
    solidJs(),
  ],
  output: "hybrid",
  // uses custom routes.json in public
  adapter: cloudflare({}),
});
