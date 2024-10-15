import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import AstroPWA from "@vite-pwa/astro";
import {defineConfig} from "astro/config";
import {visualizer} from "rollup-plugin-visualizer";
import UnoCSS from "unocss/astro";
import {loadEnv} from "vite";
import {manifest} from "./manifest";

const {SITE_URL} = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
const isDev = import.meta.env.DEV;

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      // toggle if neeing to debug locally.
      minify: true,
    },
    prefetch: {
      prefetchAll: true,
    },
    ssr: {
      noExternal: [],
      // external used only in dev to avoid calling getStaticPaths and rebuilding site sometimes.
      external: ["node:fs", "node:path"],
      // noExternal: ["path-to-regexp"],
    },
    plugins: [
      // @ts-ignore
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
      manifest: manifest,
      injectManifest: {
        globIgnores: ["**/*.html", "sw.js", "**/_worker.js/**"],
        globPatterns: ["**/*.{js,css}", "fonts/**/*", "images/**/*"],
      },
      /* your pwa options */
    }),
    UnoCSS({
      injectReset: true,
    }),
    sitemap({}),
    solidJs(),
  ],
  output: "hybrid",
  experimental: {
    serverIslands: true,
  },
  // Reminder uses custom routes.json in public
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: ".dev.vars",
    },
  }),
  image: {
    // todo env var: idk if we want to redirect or just give new biel the old domain?
    domains: ["https://bieldev.wpengine.com"],
  },
});
