import * as pagefind from "pagefind";
import {getWpmlLanguages, getResourcePageSlugs} from "./src/data/wp";
import {getLanguagesWithContentForBiel} from "./src/data/pubDataApi";
// Create a Pagefind search index to work with
const {index} = await pagefind.createIndex();

// Index all HTML files in a directory
// todo: something:
await index.addDirectory({
  path: "dist",
});
// todo: remove translations.json with new pub data api
const wpInstanceUrl = `${process.env.WORDPRESS_GQL_URL}`;
const langs = await getWpmlLanguages({gqlUrl: wpInstanceUrl});
// todo: resouce slugs and resource pages
/* 
  await index.addCustomRecord({
      url: `${baseUrl}?lang=${lang.code}`,
      content: `${theContent}`,
      language: translationPage.languageCode,
      meta: {
        title: lang.name,
        isTranslationsPage: "true",
        sort:
          lang.code.toLowerCase() === translationPage.languageCode.toLowerCase()
            ? "20"
            : "10",
      },
    });
*/
console.log({langs});

// for dev
await index.writeFiles({
  outputPath: "./src/pagefind",
});
// for prod
const prodWrite = await index.writeFiles({
  outputPath: "./dist/pagefind",
});
// clean up once complete
await pagefind.close();
