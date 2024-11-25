import { DOMParser } from "linkedom/worker";
import * as pagefind from "pagefind";
import { getLangsWithContentNames } from "./src/data/pubDataApi";
import {
	getLanguagesPageSlugs,
	getPage,
	getWpmlLanguages,
} from "./src/data/wp";
import { nonHiddenLanguageCodes } from "./src/i18n/strings";

// Create a Pagefind search index to work with

const { index } = await pagefind.createIndex({});
if (!index) {
	console.error("Could not create Pagefind index");
	process.exit(1);
}

// Index all HTML files in a directory
await index.addDirectory({
	path: "dist",
});

const wpInstanceUrl = `${process.env.WORDPRESS_GQL_URL}`;
const pubDataUrl = `${process.env.PUBLIC_DATA_API_URL}`;
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

const requests = Object.values(langs)
	.filter((l) =>
		nonHiddenLanguageCodes.includes(
			l.code as (typeof nonHiddenLanguageCodes)[number],
		),
	)
	.map((wpmlLang) => {
		// const siteDict = getDict(wpmlLang.code, true)!;
		return pubDataResource.data.language.map((pubDataResourceLanguage) => {
			return pubDataResourceLanguage.contents.map((c) => {
				const resourcePageSlug =
					wpmlLang.code === "en"
						? "/resources/languages"
						: resourcePageSlugs.data.page.translations.find(
								(t) => t.languageCode === wpmlLang.code,
							)?.uri!;
				const baseUrl =
					wpmlLang.code === "en"
						? `${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`
						: // uri comes with trailing slash from wp
							`${resourcePageSlug}${pubDataResourceLanguage.ietf_code}`;
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
					} ${insertEnglishNameIfDifferent()}  </h1>
          </body>
          </html>
          `,
					url: `${baseUrl}?resource-type=${c.name}`,
				};
			});
		});
	})
	.flat(2);

let counter = 0;
console.log(`${requests.length} req2`);

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
// for prod
const prodPageFindFilesWritten = await index.writeFiles({
	outputPath: "./dist/pagefind",
});
console.log({ prodPageFindFilesWritten });

// clean up
await pagefind.close();
