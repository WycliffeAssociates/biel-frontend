import * as pagefind from "pagefind";
import {getWpmlLanguages, getResourcePageSlugs, getPage} from "./src/data/wp";
import {getLangsWithContentNames} from "./src/data/pubDataApi";
import {getDict, nonHiddenLanguageCodes} from "./src/i18n/strings";
import {DOMParser} from "linkedom/worker";

// Create a Pagefind search index to work with

const {index} = await pagefind.createIndex({});
if (!index) {
  console.error("Could not create Pagefind index");
  process.exit(1);
}

// Index all HTML files in a directory
const res = await index.addDirectory({
  path: "dist",
});

const wpInstanceUrl = `${process.env.WORDPRESS_GQL_URL}`;
const pubDataUrl = `${process.env.PUBLIC_DATA_API_URL}`;
const langs = await getWpmlLanguages({gqlUrl: wpInstanceUrl});
const pubDataResource = await getLangsWithContentNames({
  pubDataUrl: pubDataUrl,
});
const resourcePageSlugs = await getResourcePageSlugs({
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

      const en = await index.addCustomRecord({
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
          `adding ${translation.title} - ${card.platform} - ${translation.languageCode}`
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

// Permutations need to be for each lang, for each pubDataResourceLanguage, for each contents, triply nested loop?
const requests = Object.values(langs)
  .filter((l) => nonHiddenLanguageCodes.includes(l.code))
  .map((wpmlLang) => {
    const siteDict = getDict(wpmlLang.code, true)!;
    return pubDataResource.data.language.map((pubDataResourceLanguage) => {
      const resourcePageSlug =
        wpmlLang.code === "en"
          ? "/resources"
          : resourcePageSlugs.data.page.translations.find(
              (t) => t.languageCode === wpmlLang.code
            )?.slug!;
      const baseUrl =
        wpmlLang.code === "en"
          ? `${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`
          : `/${wpmlLang.code}/${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`;
      function insertEnglishNameIfDifferent() {
        if (
          pubDataResourceLanguage.english_name !==
          pubDataResourceLanguage.national_name
        ) {
          return `<small> (${pubDataResourceLanguage.english_name}) </small>`;
        }
        return "";
      }

      const uniqueContentTypes = [
        ...new Set(
          pubDataResourceLanguage.contents.map((c) => {
            return c.resource_type;
          })
        ),
      ].join("/");
      // console.log(uniqueContentTypes, pubDataResourceLanguage.english_name);
      const wrapped = `<small> ${uniqueContentTypes} </small>`;
      return {
        language: wpmlLang.code,
        content: `
        <html lang="${wpmlLang.code}" data-pagefind-meta="type:resource">
        <body> 
        <h1 > ${
          pubDataResourceLanguage.national_name
        } ${insertEnglishNameIfDifferent()} </h1>
        <div> ${wrapped} </div>
        </body> 
        </html>
          `,
        url: baseUrl,
        meta: {
          title: `${
            pubDataResourceLanguage.national_name
          } ${insertEnglishNameIfDifferent()}`,
          type: siteDict.resource,
        },
      };
    });
  })
  .flat(2);

const request2 = Object.values(langs)
  .filter((l) => nonHiddenLanguageCodes.includes(l.code))
  .map((wpmlLang) => {
    const siteDict = getDict(wpmlLang.code, true)!;
    return pubDataResource.data.language.map((pubDataResourceLanguage) => {
      return pubDataResourceLanguage.contents.map((c) => {
        const resourcePageSlug =
          wpmlLang.code === "en"
            ? "/resources"
            : resourcePageSlugs.data.page.translations.find(
                (t) => t.languageCode === wpmlLang.code
              )?.slug!;
        const baseUrl =
          wpmlLang.code === "en"
            ? `${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`
            : `/${wpmlLang.code}/${resourcePageSlug}/${pubDataResourceLanguage.ietf_code}`;
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
          <h1> ${c.title || c.resource_type} -  ${
            pubDataResourceLanguage.national_name
          } ${insertEnglishNameIfDifferent()}  </h1>
          </body>
          </html>
          `,
          url: `${baseUrl}?resource=${c.name}`,
        };
      });
    });
  })
  .flat(2);

let counter = 0;
console.log(`${request2.length} req2`);

for await (const request of request2) {
  if (counter % 100 === 0) {
    console.log(
      `Adding ${counter} of ${requests.length} total resources to index`
    );
  }
  counter++;
  await index.addHTMLFile(request);
}

// // for dev
const devPageFindFilesWritten = await index.writeFiles({
  outputPath: "./src/pagefind",
});
console.log({devPageFindFilesWritten});
// for prod
const prodPageFindFilesWritten = await index.writeFiles({
  outputPath: "./dist/pagefind",
});
console.log({prodPageFindFilesWritten});

// clean up
await pagefind.close();
