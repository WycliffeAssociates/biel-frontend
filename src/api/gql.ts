import type {
  WPMLMenu,
  WpPage,
  footerType,
  languageType,
} from "@customTypes/types";
import {flatMenuToHierachical} from "@src/utils";
import {DOMParser} from "linkedom";

const editorBlocksFields = `
parentClientId
name
renderedHtml
`;
export async function getHomePage() {
  const query = `
    query homePage {
      page(id: "/", idType: URI) {
        title
        link
        editorBlocks(flat:true) {
          ${editorBlocksFields}
         }
      }
    }
  `;
  const gqlUrl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_GQL_PATH
  }`;
  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const json = (await response.json()) as {data: {page: WpPage}};

  return json.data;
}

export async function getPage(uri: string, langCode: string) {
  const allPagesOfThisLangReq = `
    query allPagesThisLang($lang: String!) {
      pages(where: {language: $lang}, first: 100) {
        nodes {
          databaseId
          uri
        }
      }
    }
  `;
  if (uri.includes("home")) {
    uri = "/";
  }
  const gqlUrl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_GQL_PATH
  }`;
  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: allPagesOfThisLangReq,
      variables: {
        lang: langCode,
      },
    }),
  });
  const allLangPages = (await response.json()) as {
    data: {
      pages: {
        nodes: {databaseId: number; uri: "string"}[];
      };
    };
  };

  const pageWithMatchingUri = allLangPages.data.pages.nodes.find(
    (page) => page.uri == (uri == "/" ? "/" : `/${uri}/`)
  );

  if (!pageWithMatchingUri) return;

  const thatPageReq = `
    query pageQuery($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        databaseId
        slug
        title
        modified
        status
        parentDatabaseId
        link
        languageCode
        uri
        editorBlocks(flat:true) {
         ${editorBlocksFields}
        }
        translations {
          editorBlocks(flat:true) {
            ${editorBlocksFields}
           }
          title(format: RENDERED)
          databaseId
          slug
          status
          link
          languageCode
          uri
          modified
          parentDatabaseId
        }
      }
    }
  `;

  const thatPageRes = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: thatPageReq,
      variables: {
        id: pageWithMatchingUri.databaseId,
      },
    }),
  });

  const thatPageData = (await thatPageRes.json()) as {
    data: {page: WpPage};
  };

  const {page} = thatPageData.data;

  page.isHomePage = page.uri == "/";
  page.isTranslationPage =
    page.title.toLowerCase() == "translations" ||
    page.translations.some((t) => t.title.toLowerCase() == "translations");
  const otherVersions: Record<string, string> = {};
  page.translations.forEach((t) => {
    otherVersions[t.languageCode] = t.uri;
  });
  page.otherVersions = otherVersions;

  page.translations.forEach((t) => {
    const otherVersions: Record<string, string> = {};
    page.translations.forEach((trans) => {
      otherVersions[trans.languageCode] = trans.uri;
      // otherVersions.set(trans.languageCode, trans.databaseId);
    });
    otherVersions["en"] = page.uri;
    t.translationOfId = page.databaseId;
    t.otherVersions = otherVersions;
    t.isHomePage = page.uri == "/";
    t.isTranslationPage = page.isTranslationPage;
    if (page.isTranslationPage) {
    }
  });

  return page;
}

export async function getAllPages() {
  const query = `
    query allPages {
      pages(first: 100, where: {language: "en"}) {
        nodes {
          databaseId
          slug
          title
          modified
          status
          parentDatabaseId
          link
          languageCode
          uri
          editorBlocks(flat:true) {
           ${editorBlocksFields}
          }
          translations {
            editorBlocks(flat:true) {
              ${editorBlocksFields}
             }
            title(format: RENDERED)
            databaseId
            slug
            status
            link
            languageCode
            uri
            modified
            parentDatabaseId
          }
        }
      }
    }
  `;
  const gqlUrl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_GQL_PATH
  }`;

  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const result = (await response.json()) as {
    data: {pages: {nodes: WpPage[]}};
  };
  const {pages} = result.data;

  if (!result) {
    throw new Error("could not fetch");
  }

  type langCode = string;
  type withoutTranslation = Omit<WpPage, "translations">;
  let pagesByLangCode: Record<
    langCode,
    Record<langCode, withoutTranslation>
  > = {
    en: {},
  };

  for (let i = 0; i < pages.nodes.length; i++) {
    const page = pages.nodes[i];
    if (!page) continue;
    // if (page.slug?.toLowerCase() != "home") {
    // Every page needs an otherVersions to all others in the form of langCode -> databaseId of the localized version:
    page.isHomePage = page.uri == "/";
    page.isTranslationPage = page.title.toLowerCase() == "translations";
    const otherVersions: Record<string, string> = {};
    page.translations.forEach((t) => {
      otherVersions[t.languageCode] = String(t.databaseId);
    });
    page.otherVersions = otherVersions;
    const {translations, ...rest} = page;
    if (pagesByLangCode.en) {
      pagesByLangCode.en[rest.databaseId] = rest;
    }
    translations.forEach((translation) => {
      const otherVersions: Record<string, string> = {};
      translations.forEach((trans) => {
        otherVersions[trans.languageCode] = String(trans.databaseId);
      });
      otherVersions["en"] = String(rest.databaseId);
      translation.translationOfId = rest.databaseId;
      translation.otherVersions = otherVersions;
      // NOTE we don't need to know if other langauges use Genesis blocks, bc we are assuming that we want all pages to be synced in content.  I.e. We are not going to have different layouts for different languages, and we'll change if explicitly told to.  If we want to just disable a page for a language, can probably reach for acf
      if (!pagesByLangCode[translation.languageCode]) {
        pagesByLangCode[translation.languageCode] = {};
      }

      translation.isHomePage = rest.uri == "/";
      translation.isTranslationPage = rest.isTranslationPage;
      if (rest.uri == "/") {
        translation.uri = `/${translation.languageCode}`;
        // Wpml also have these uri's as /, but they are really /langCode
      }
      let byLang = pagesByLangCode[translation.languageCode];
      if (byLang) {
        byLang[translation.databaseId] = translation;
      }
    });
  }

  return {pagesByLangCode};
}
export async function getWpmlLanguages() {
  const query = `
    query langs {
      languages {
        code
        country_flag_url
        language_code
        native_name
        translated_name
      }
    }
  `;
  const gqlUrl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_GQL_PATH
  }`;
  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const result = (await response.json()) as {
    data: {languages: Array<languageType>};
  };

  const asMap = result.data.languages.reduce(
    (acc: Record<string, languageType>, current) => {
      acc[current.code] = current;
      return acc;
    },
    {}
  );

  return asMap;
}
export async function getMenus() {
  const restURl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_REST_MENU_ENDPOINT
  }`;

  const result = await fetch(restURl, {
    headers: {"Content-Type": "application/json"},
  });

  const res = (await result.json()) as WPMLMenu;
  Object.keys(res).forEach((key) => {
    const menu = res[key];
    if (menu) {
      Object.keys(menu).forEach((menuLocation) => {
        const rawMenu = menu[menuLocation];
        if (rawMenu) {
          const shapedMenu = flatMenuToHierachical(rawMenu);
          menu[menuLocation] = shapedMenu;
        }
      });
    }
  });

  return res;
}
export async function getFooter(langCode: string) {
  const footerSlug = "footer-old";
  const query = `
    query getFooter {
      global(id: "${footerSlug}", idType: SLUG) {
        content(format: RENDERED)
        uri
        link
        translations {
          languageCode
          content(format: RENDERED)
        }
      }
    }
  `;
  const gqlUrl = `${import.meta.env.SITE_URL}/${
    import.meta.env.WORDPRESS_GQL_PATH
  }`;
  try {
    const response = await fetch(gqlUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query}),
    });
    const result = (await response.json()) as {data: footerType};

    let fetchLink = result.data.global.link;
    const fetchFooter = await fetch(fetchLink);
    const domText = await fetchFooter.text();
    const footerDom = new DOMParser().parseFromString(domText, "text/html");
    const inlineStyleIds = [
      "generateblocks-inline-css",
      "global-styles-inline-css",
      "generate-style-inline-css",
    ];
    const inlineStyles = inlineStyleIds.map((id) => {
      const styleTag: HTMLStyleElement | undefined = footerDom.querySelector(
        `#${id}`
      );
      if (styleTag) {
        return styleTag.innerHTML;
      } else return "";
    });
    const footerToUse =
      langCode == "en"
        ? result.data.global
        : result.data.global.translations.find(
            (t) => t.languageCode == langCode
          ) || result.data.global; //fallback to english if not translation with this langcode;

    return {footerInlineStyles: inlineStyles, footer: footerToUse};
  } catch (error) {
    console.error("footer fetch failed");
    console.error(error);
  }
}
