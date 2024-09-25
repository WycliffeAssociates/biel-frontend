import type {
  WPMLMenu,
  WpPage,
  footerType,
  languageType,
} from "@customTypes/types";
import {flatMenuToHierachical} from "@src/utils";
import {DOMParser} from "linkedom/worker";

const editorBlocksFields = `
parentClientId
name
renderedHtml
`;
const heroFields = `
topBlurb
heroLinks {
  heroLinkText
  heroLinkUrl
  linkStyle
  heroLinkIcon
}
`;
export async function getHomePage({gqlUrl}: {gqlUrl: string}) {
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
  // todo: see fi I cna fix url for prod by passing in env. everywehre there is a gql url. Gotta use the CF rutime and pass it in.
  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const json = (await response.json()) as {data: {page: WpPage}};

  return json.data;
}
export async function getResourcePageSlugs({gqlUrl}: {gqlUrl: string}) {
  const query = `
  query resourcesSlugsQuery {
  page(id: "resources", idType: URI) {
    slug
    title
    translations {
      languageCode
      slug
      title
    }
  }
}
  `;

  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const json = (await response.json()) as {
    data: {
      page: {
        slug: string;
        title: string;
        translations: {languageCode: string; slug: string; title: string}[];
      };
    };
  };
  /* 
 { languageCode: 'es', slug: 'recursos', title: 'Recursos' },
    { languageCode: 'fa', slug: 'منابع', title: 'منابع' },
    { languageCode: 'fr', slug: 'ressources', title: 'Les ressources' },
    { languageCode: 'hi', slug: 'संसाधनों', title: 'संसाधनों' },
    { languageCode: 'id', slug: 'sumber-daya', title: 'Sumber Daya' },
    { languageCode: 'pt-br', slug: 'recursos', title: 'Recursos' },
    { languageCode: 'ru', slug: 'ресурсы', title: 'Ресурсы' },
    { languageCode: 'th', slug: 'ทรัพยากร', title: 'ทรัพยากร' },
    { languageCode: 'ur', slug: 'وسائل', title: 'وسائل' },
    { languageCode: 'zh-hans', slug: '资源', title: '资源' }
*/
  return json;
}

export async function getPage({
  uri,
  langCode,
  gqlUrl,
}: {
  uri: string;
  langCode: string;
  gqlUrl: string;
}) {
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
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
        ancestors {
          nodes {
            slug
            uri
          }
        }
        pageOptions {
          topBlurb
          ${heroFields}
        }
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
  // Contact page has its own layout
  page.isContactPage =
    page.title.toLowerCase() == "contact us" ||
    page.translations.some((t) => t.title.toLowerCase() == "contact us");
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
    t.isContactPage = page.isContactPage;
  });

  return page;
}

// todo: tag the resourcesPage and then in stat /slug/whatever use server:defer to make it a server island, just cause I don't want to render the header (and maybe the footer) on the server.  Yeah, in fact, just use a server catch all route in the root of pages, import from build time a /ressources/x... typee thing. And then /ressources is the single and /x routes to view of that lang content
export async function getAllPages({gqlUrl}: {gqlUrl: string}) {
  // todo: gql has an ancestors field, but it only seems to populate for english. But given that this fetches from english and has all pages, For each translation, I should be able to do an allPages.find(englishPage -> englishPage.slug == its ancestor slug) to populate across. Or rather, ancesotrs for each ancestor, allPages.find(ep => ep.slug == ancestor.slug) and then translations.find on that.
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
          featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
          ancestors {
            nodes {
              slug
              uri
              databaseId
            }
          }
          pageOptions {
            iconPreTitle {
            sourceUrl(size: THUMBNAIL)
            }
            ${heroFields}
          }
          editorBlocks(flat:true) {
           ${editorBlocksFields}
          }
          translations {
            editorBlocks(flat:true) {
              ${editorBlocksFields}
             }
            pageOptions {
              ${heroFields}
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
  const filteredNodes = pages.nodes.filter((p) => {
    return p.title.toLowerCase() != "resources";
  });

  for (let i = 0; i < filteredNodes.length; i++) {
    const page = filteredNodes[i];
    if (!page) continue;
    // if (page.slug?.toLowerCase() != "home") {

    // Set soem flags for special pages that get handled differently;
    page.isHomePage = page.uri == "/";
    page.isTranslationPage = page.title.toLowerCase() == "translations";
    page.isContactPage =
      page.title.toLowerCase() == "contact us" ||
      page.translations.some((t) => t.title.toLowerCase() == "contact us");
    // Every page needs an otherVersions to all others in the form of langCode -> databaseId of the localized version: This is populating it for english, and we'll do same below;
    const otherVersions: Record<string, string> = {};
    page.translations.forEach((t) => {
      otherVersions[t.languageCode] = String(t.databaseId);
    });
    page.otherVersions = otherVersions;
    const {translations, ...enPage} = page;
    if (pagesByLangCode.en) {
      pagesByLangCode.en[enPage.databaseId] = enPage;
    }
    translations.forEach((translation) => {
      // Used to populate links for i18n.. Ie, the other version of "recursos" in sp is "ressources" in fr
      const otherVersions: Record<string, string> = {};
      translations.forEach((trans) => {
        otherVersions[trans.languageCode] = String(trans.databaseId);
        trans.featuredImage = page.featuredImage;
      });
      // manually poipulat the en one
      otherVersions["en"] = String(enPage.databaseId);
      translation.translationOfId = enPage.databaseId;
      translation.otherVersions = otherVersions;
      // NOTE we don't need to know if other langauges use Genesis blocks, bc we are assuming that we want all pages to be synced in content.  I.e. We are not going to have different layouts for different languages, and we'll change if explicitly told to.  If we want to just disable a page for a language, can probably reach for acf
      if (!pagesByLangCode[translation.languageCode]) {
        pagesByLangCode[translation.languageCode] = {};
      }

      // flags for special
      translation.isHomePage = enPage.uri == "/";
      translation.isTranslationPage = enPage.isTranslationPage;
      translation.isContactPage = enPage.isContactPage;
      if (enPage.uri == "/") {
        // Wpml / WP also have these uri's as /, but they are really /langCode cause we aren't ssr rendering / to whatever lang you want.  It's got to be at a different uri
        translation.uri = `/${translation.languageCode}`;
      }

      // Sort out the breadcrumbs;
      enPage.ancestors?.nodes.forEach((ancestor) => {
        const matching = filteredNodes.find(
          (page) => page.databaseId == ancestor.databaseId
        );
        if (!translation.ancestors) {
          translation.ancestors = {
            nodes: [],
          };
        }
        if (!matching) return;
        const thatLangTranslation = matching.translations.find(
          (t) => t.languageCode == translation.languageCode
        );
        if (!thatLangTranslation) return;
        // todo: verify if this works;
        translation.ancestors.nodes.push({
          uri: `${thatLangTranslation.uri}`,
          slug: thatLangTranslation.slug,
          databaseId: thatLangTranslation.databaseId,
        });
      });

      let byLang = pagesByLangCode[translation.languageCode];
      if (byLang) {
        byLang[translation.databaseId] = translation;
      }
    });
  }
  const englishUrisMap = Object.values(pagesByLangCode.en!).reduce(
    (acc: Record<string, Record<string, string>>, curr) => {
      acc[curr.uri] = curr.otherVersions;
      return acc;
    },
    {}
  );
  return {pagesByLangCode};
}

/**
 * Get a map of English URIs to their translations. When wpml acts up, you can strings replace all /resources with /es/recursos on a page as needed.
 * @returns A Promise that resolves to an object with an `englishUriMap` property. The `englishUriMap` property is an object where the keys are the translated URIs and the values are the URIs of the English version of the page.
 */
export async function getEnglishUriMap({gqlUrl}: {gqlUrl: string}) {
  const query = `
  query allPages {
      pages(first: 1000, where: {language: "en"}) {
        nodes {
          slug
          uri
          translations {
            languageCode
            uri
          }
      }
  }
}
  `;
  const response = await fetch(gqlUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const result = (await response.json()) as {
    data: {
      pages: {
        nodes: Array<{
          slug: string;
          uri: string;
          translations: Array<{
            languageCode: string;
            uri: string;
          }>;
        }>;
      };
    };
  };

  const asMap = result.data.pages.nodes.reduce(
    (acc: Record<string, Record<string, string>>, enPage) => {
      acc[enPage.uri] = {};
      enPage.translations.forEach((t) => {
        acc[enPage.uri]![t.languageCode] = t.uri;
      });
      return acc;
    },
    {}
  );
  return {englishUriMap: asMap};
}
export async function getWpmlLanguages({gqlUrl}: {gqlUrl: string}) {
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
export async function getMenus({restUrl}: {restUrl: string}) {
  const result = await fetch(restUrl, {
    headers: {"Content-Type": "application/json"},
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
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

export async function getGlobal({
  slug,
  langCode,
  gqlUrl,
}: {
  slug: string;
  langCode: string;
  gqlUrl: string;
}) {
  const query = `
    query getGlobal {
      global(id: "${slug}", idType: SLUG) {
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
  try {
    const response = await fetch(gqlUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query}),
    });
    // todo: this isn't a footer type, but shape is same
    const result = (await response.json()) as {data: footerType};

    let fetchLink = result.data.global.link;
    const fetchGlobal = await fetch(fetchLink);
    const domText = await fetchGlobal.text();
    const globalDom = new DOMParser().parseFromString(domText, "text/html");
    const inlineStyleIds = [
      "generateblocks-inline-css",
      "global-styles-inline-css",
      "generate-style-inline-css",
    ];
    const inlineStyles = inlineStyleIds.map((id) => {
      const styleTag: HTMLStyleElement | undefined = globalDom.querySelector(
        `#${id}`
      );
      if (styleTag) {
        return styleTag.innerHTML;
      } else return "";
    });
    const globalToUse =
      langCode == "en"
        ? result.data.global
        : result.data.global.translations.find(
            (t) => t.languageCode == langCode
          ) || result.data.global; //fallback to english if not translation with this langcode;
    return {
      inlineStyles: inlineStyles,
      global: globalToUse,
      content: globalToUse.content,
      allLangsGlobal: result.data.global,
    };
  } catch (error) {
    console.error("footer fetch failed");
    console.error(error);
  }
}
export async function getFooter({
  langCode,
  gqlUrl,
}: {
  langCode: string;
  gqlUrl: string;
}) {
  const footerSlug = "footer-new";
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
