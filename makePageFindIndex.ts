import fs from "node:fs/promises";
import { DOMParser } from "linkedom/worker";
import * as pagefind from "pagefind";
import { loadEnv } from "vite";
import { getLangsWithContentNames } from "./src/data/pubDataApi";
import {
	getLanguagesPageSlugs,
	getPage,
	getWpmlLanguages,
} from "./src/data/wp";
import { nonHiddenLanguageCodes } from "./src/i18n/strings";

const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
for (const [key, value] of Object.entries(env)) {
	process.env[key] ??= value;
}

// Create a Pagefind search index to work with
console.log("creating page find index");
const { index } = await pagefind.createIndex({});
if (!index) {
	console.error("Could not create Pagefind index");
	process.exit(1);
}

// Index all HTML files in a directory
console.log("adding dist");
await index.addDirectory({
	path: "dist",
});

const wpInstanceUrl = process.env.WORDPRESS_GQL_URL;
const pubDataUrl =
	process.env.PUBLIC_DATA_API_URL || process.env.PUBLIC_DATA_API;
const siteUrl = process.env.SITE_URL;
if (!wpInstanceUrl || !pubDataUrl || !siteUrl) {
	throw new Error(
		"Pagefind generation requires WORDPRESS_GQL_URL, SITE_URL, and PUBLIC_DATA_API_URL or PUBLIC_DATA_API.",
	);
}
console.log("getting languages");
const langs = await getWpmlLanguages({ gqlUrl: wpInstanceUrl });

const pubDataResource = await getLangsWithContentNames({
	pubDataUrl: pubDataUrl,
});
const resourcePageSlugs = await getLanguagesPageSlugs({
	gqlUrl: wpInstanceUrl,
});

const softwarePages = await Promise.all([
	await getPage({
		gqlUrl: wpInstanceUrl,
		uri: "software/orature",
		langCode: "en",
	}),
	await getPage({
		gqlUrl: wpInstanceUrl,
		uri: "software/writer",
		langCode: "en",
	}),
	await getPage({
		gqlUrl: wpInstanceUrl,
		uri: "software/usfm-converter",
		langCode: "en",
	}),
	await getPage({
		gqlUrl: wpInstanceUrl,
		uri: "software/recorder",
		langCode: "en",
	}),
]);
for await (const page of softwarePages) {
	if (page) {
		const body = page.editorBlocks
			.filter((b) => b.parentClientId == null)
			.map((b) => b.renderedHtml)
			.join("\n");
		const dom = new DOMParser().parseFromString(body, "text/html");
		const cards = [...dom.querySelectorAll(".platform-detect")];
		console.log(cards.length);
		const cardsRecords = cards.map((c) => {
			const href = c.querySelector("a")?.getAttribute("href");
			const lastSegment = href?.split("/").pop();
			const classList = c.classList;
			const platform = c.classList.contains("platform-detect-mac")
				? "Mac"
				: c.classList.contains("platform-detect-windows")
					? "Windows"
					: c.classList.contains("platform-detect-linux")
						? "Linux"
						: "Other";
			return {
				href,
				classList,
				platform,
				downloadName: lastSegment,
			};
		});

		for await (const card of cardsRecords) {
			// english
			console.log(`adding ${page.title} - ${card.platform}`);

			await index.addCustomRecord({
				content: `${page.title} - ${card.platform} - en`,
				language: "en",
				url: card.href
					? `${card.href!}?lang=en`
					: `${card.platform}/${page.slug}?lang=en`, //second is fallback
				meta: {
					type: "software",
					title: `${page.title} - ${card.platform} (en)`,
					download: card.downloadName,
					platform: card.platform,
				},
			});
			// translations
			for await (const translation of page.translations) {
				console.log(
					`adding ${translation.title} - ${card.platform} - ${translation.languageCode}`,
				);
				await index.addCustomRecord({
					content: `${translation.title} - ${card.platform} (${translation.languageCode})`,
					language: translation.languageCode,
					url: card.href
						? `${card.href!}?lang=${translation.languageCode}`
						: `${card.platform}/${translation.slug}?lang=${translation.languageCode}`, //second is fallback
					meta: {
						type: "software",
						title: `${translation.title} - ${card.platform} (${translation.languageCode})`,
						download: card.downloadName,
						platform: card.platform,
					},
				});
			}
		}
	}
}
const siteMapAdditions: string[] = [];
console.log("generating resources pages");
const requests = Object.values(langs)
	.filter((l) =>
		nonHiddenLanguageCodes.includes(
			l.code as (typeof nonHiddenLanguageCodes)[number],
		),
	)
	.map((wpmlLang) => {
		// const siteDict = getDict(wpmlLang.code, true)!;
		return pubDataResource.data.language.map((pubDataResourceLanguage) => {
			const resourcePageSlug =
				wpmlLang.code === "en"
					? "/resources/languages"
					: resourcePageSlugs.data.page.translations.find(
							(t) => t.languageCode === wpmlLang.code,
						)?.uri;
			const baseUrl =
				wpmlLang.code === "en"
					? `${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`
					: // uri comes with trailing slash from wp
						`${resourcePageSlug}${pubDataResourceLanguage.ietf_code}`;
			siteMapAdditions.push(`${siteUrl}${baseUrl}`);
			return pubDataResourceLanguage.contents.map((c) => {
				function insertEnglishNameIfDifferent() {
					if (
						pubDataResourceLanguage.english_name !==
						pubDataResourceLanguage.national_name
					) {
						return `<small> (${pubDataResourceLanguage.english_name}) </small>`;
					}
					return "";
				}
				return {
					language: wpmlLang.code,
					content: `
          <html lang="${wpmlLang.code}" data-pagefind-meta="type:resource">
          <body> 
          <h1> ${c.displayName} -  ${
						pubDataResourceLanguage.national_name
					} ${insertEnglishNameIfDifferent()} </h1>
					<p> <small> ${c.resource_type} </small> </p>
          </body>
          </html>
          `,
					url: `${baseUrl}?resource-type=${encodeURIComponent(c.name)}`,
				};
			});
		});
	})
	.flat(2);

let counter = 0;
console.log(`${requests.length} req`);

console.log(siteMapAdditions);

for await (const request of requests) {
	if (counter % 100 === 0) {
		console.log(
			`Adding ${counter} of ${requests.length} total resources to index`,
		);
	}
	counter++;
	await index.addHTMLFile(request);
}

// // for dev
const devPageFindFilesWritten = await index.writeFiles({
	outputPath: "./src/pagefind",
});
console.log({ devPageFindFilesWritten });
// for prod Pages and Workers deployments
const distPageFindFilesWritten = await index.writeFiles({
	outputPath: "./dist/pagefind",
});
console.log({ distPageFindFilesWritten });
const workerPageFindFilesWritten = await index.writeFiles({
	outputPath: "./dist/client/pagefind",
});
console.log({ workerPageFindFilesWritten });

async function updateSitemap0Xml(xmlPath: string) {
	try {
		const distXml = await fs.readFile(xmlPath, {
			encoding: "utf-8",
		});
		const endOfUrlSetIdx = distXml.indexOf("</urlset>");
		if (!endOfUrlSetIdx) return;
		const firstPart = distXml.slice(0, endOfUrlSetIdx);
		const additions = siteMapAdditions
			.map((a) => `<url>\n<loc>${a}</loc>\n</url>`)
			.join("\n");
		const end = distXml.slice(endOfUrlSetIdx);
		const newString = `${firstPart}\n${additions}\n${end}`;

		await fs.writeFile(xmlPath, newString);
		// console.log({built});
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"code" in error &&
			error.code === "ENOENT"
		) {
			return;
		}
		console.error(error);
	}
}

await updateSitemap0Xml("./dist/sitemap-0.xml");
await updateSitemap0Xml("./dist/client/sitemap-0.xml");

// clean up
await pagefind.close();
