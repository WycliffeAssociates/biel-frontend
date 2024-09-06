import * as pagefind from "pagefind";

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
// todo: something:
await index.addDirectory({
  path: "dist",
});

const loc = process.env.TRANSLATIONS_JSON_ENDPOINT;
const td = await fetch(loc);

const translationsDataBlob = await td.blob();
const translationsDataText = await translationsDataBlob.text();
const translationsData = await JSON.parse(translationsDataText);
console.log(`fetched ${translationsData.length} lang data`);

const wpInstanceUrl = `${process.env.CMS_URL}/${process.env.WORDPRESS_GQL_PATH}`;
const query = `query getTranslationsPage {
  page(id: "translations", idType: URI) {
    languageCode
    title
    translations {
      languageCode
      title
      slug
      uri
    }
  }
}`;
const langsRes = await fetch(wpInstanceUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: query,
  }),
});
const translationPages = await langsRes.json();
// So we don't have to do anything extra for english and can just go through the translations array;
translationPages.data.page.translations.push({
  languageCode: "en",
  title: "English",
});

for await (const lang of translationsData) {
  for await (const translationPage of translationPages.data.page.translations) {
    const baseUrl =
      translationPage.languageCode == "en"
        ? "translations"
        : `${translationPage.languageCode}/${translationPage.slug}`;

    const contents = lang.contents
      .map((content) => {
        return content.name;
      })
      .join("\n");
    const theContent = `
    ${lang.name}
    ${contents}
    `;

    await index.addCustomRecord({
      url: `${baseUrl}?lang=${lang.code}`,
      content: `${theContent}`,
      language: translationPage.languageCode,
      meta: {
        title: lang.name,
        isTranslationsPage: "true",
        sort:
          lang.code.toLowerCase() == translationPage.languageCode.toLowerCase()
            ? "20"
            : "10",
      },
    });
  }
}
console.log("writing out files");
// for dev
await index.writeFiles({
  outputPath: "./src/pagefind",
});
// for prod
const prodWrite = await index.writeFiles({
  outputPath: "./dist/pagefind",
});
console.log({ prodWrite });
// clean up once complete
await pagefind.close();
