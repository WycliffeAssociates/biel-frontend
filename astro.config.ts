import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
// import { visualizer } from "rollup-plugin-visualizer";
import UnoCSS from "@unocss/astro";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { manifest } from "./manifest";

const env = loadEnv(process.env.NODE_ENV!, process.cwd(), "");
const { SITE_URL, PUBLIC_ENABLE_SW_DEV } = env;
const isDev = process.env.NODE_ENV === "development";
// https://astro.build/config
export default defineConfig({
	vite: {
		build: {
			// toggle if neeing to debug locally.
			minify: true,
		},
		ssr: {
			noExternal: [],
			// external used only in dev to avoid calling getStaticPaths and rebuilding site sometimes.
			external: ["node:fs", "node:path", "node:buffer"],
			// noExternal: ["path-to-regexp"],
		},
		plugins: [
			// See the below link for bundle size recs.  That said, if you look at the analyse.html, it's less useful becasue it generates a report before tree shaking.   It does however give you a good idea of relative sizes of deps and composition of your bundle if something looks awry.  For the best overview of what a page load and bundle looks like, just look through the network tab on load
			// https://infrequently.org/2024/01/performance-inequality-gap-2024/
			// The TLDR 2024 on Budget is this:
			/*
      P75 device and network 3 seconds:
      Markup Based:   1.4Mib.  (1.3Mib, + 75kib JS)
      JS Based:  730Kib (365Kib markup and 365 Kib js)

      P75 device and network 5 seconds:
      Markup Based:   2.5Mib.  (2.4Mib, + 100kib JS)
      JS Based:  1.3Mib (650 Kib markup and 650 Kib js)
      */
			// visualizer({
			// 	template: "treemap", // or sunburst
			// 	open: false,
			// 	gzipSize: true,
			// 	brotliSize: true,
			// 	filename: "analyse.html", // will be saved in project's root
			// }),
		],
	},

	site: SITE_URL,
	integrations: [
		AstroPWA({
			devOptions: {
				enabled: PUBLIC_ENABLE_SW_DEV === "true",
				type: "module",
			},
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.ts",
			registerType: "autoUpdate",
			manifest: manifest,
			injectManifest: {
				globIgnores: [
					"**/*.html",
					"sw.js",
					"**/_worker.js/**",
					"_astro/pdf.worker-*.js",
				],
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
	output: "server",
	devToolbar: {
		enabled: false,
	},
	prefetch: {
		prefetchAll: !isDev,
		defaultStrategy: "hover",
	},
	// Reminder uses custom routes.json in public
	adapter: cloudflare({
		// Astro v6 + cloudflare adapter v13 defaults to cloudflare-binding.
		// Keep prior build-time image behavior to avoid runtime behavior drift.
		imageService: "compile",
	}),
	image: {
		// todo env var: idk if we want to redirect or just give new biel the old domain?
		domains: ["https://bieldev.wpengine.com", "https://biel.wpengine.com"],
	},
});
