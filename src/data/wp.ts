import type {
  FooterType,
  WPMLMenu,
  WpPage,
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
  // due to routing.  can't route to just / for this preview route
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
    (page) => page.uri === (uri === "/" ? "/" : `/${uri}/`)
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
						... on Page {
							title
						}
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

  page.isHomePage = page.uri === "/";
  if (!page.isHomePage) {
    // Ancestors are actually treated like crumbs, and we want to always give a clear link back to home, and then indicate the current as well
    if (!page.ancestors?.nodes) {
      page.ancestors = {nodes: []};
    }
    page.ancestors.nodes.unshift({
      uri: "/",
      slug: "/",
      title: "Home",
    });
    page.ancestors.nodes.push({
      uri: page.uri,
      slug: page.slug,
      title: page.title,
      databaseId: page.databaseId,
    });
  }

  // Contact page has its own layout
  page.isContactPage =
    page.title.toLowerCase() === "contact us" ||
    page.translations.some((t) => t.title.toLowerCase() === "contact us");
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
    otherVersions.en = page.uri;
    t.translationOfId = page.databaseId;
    t.otherVersions = otherVersions;
    t.isHomePage = page.uri === "/";
    t.isContactPage = page.isContactPage;
  });

  return page;
}

export async function getAllPages({gqlUrl}: {gqlUrl: string}) {
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
							... on Page {
							title
							}
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
  const pagesByLangCode: Record<
    langCode,
    Record<langCode, withoutTranslation>
  > = {
    en: {},
  };
  // resources is ssr, not static.
  const filteredNodes = pages.nodes.filter((p) => {
    return p.title.toLowerCase() !== "resources";
  });

  for (let i = 0; i < filteredNodes.length; i++) {
    const page = filteredNodes[i];
    if (!page) continue;
    // if (page.slug?.toLowerCase() != "home") {

    // Set soem flags for special pages that get handled differently;
    page.isHomePage = page.uri === "/";
    if (!page.isHomePage) {
      // Ancestors are actually treated like crumbs, and we want to always give a clear link back to home, and then indicate the current as well
      if (!page.ancestors?.nodes) {
        page.ancestors = {nodes: []};
      }
      const homePage = pages.nodes.find((p) => p.uri === "/");
      page.ancestors.nodes.unshift({
        uri: "/",
        slug: "/",
        title: "Home",
        databaseId: homePage?.databaseId,
      });
      page.ancestors.nodes.push({
        uri: page.uri,
        slug: page.slug,
        title: page.title,
        databaseId: page.databaseId,
      });
    }
    page.isContactPage =
      page.title.toLowerCase() === "contact us" ||
      page.translations.some((t) => t.title.toLowerCase() === "contact us");
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
      otherVersions.en = String(enPage.databaseId);
      translation.translationOfId = enPage.databaseId;
      translation.otherVersions = otherVersions;
      // NOTE we don't need to know if other langauges use Genesis blocks, bc we are assuming that we want all pages to be synced in content.  I.e. We are not going to have different layouts for different languages, and we'll change if explicitly told to.  If we want to just disable a page for a language, can probably reach for acf
      if (!pagesByLangCode[translation.languageCode]) {
        pagesByLangCode[translation.languageCode] = {};
      }

      // flags for special
      translation.isHomePage = enPage.uri === "/";
      translation.isContactPage = enPage.isContactPage;
      if (enPage.uri === "/") {
        // Wpml / WP also have these uri's as /, but they are really /langCode cause we aren't ssr rendering / to whatever lang you want.  It's got to be at a different uri
        translation.uri = `/${translation.languageCode}`;
      }

      // Sort out the breadcrumbs;
      enPage.ancestors?.nodes.forEach((ancestor) => {
        const matching = filteredNodes.find(
          (page) => page.databaseId === ancestor.databaseId
        );
        if (!translation.ancestors) {
          translation.ancestors = {
            nodes: [],
          };
        }
        if (!matching) return;
        const thatLangTranslation = matching.translations.find(
          (t) => t.languageCode === translation.languageCode
        );
        if (!thatLangTranslation) return;
        // todo: special case handling for home page here
        translation.ancestors.nodes.push({
          uri: `${thatLangTranslation.uri}`,
          slug: thatLangTranslation.slug,
          databaseId: thatLangTranslation.databaseId,
          title: thatLangTranslation.title,
        });
      });

      const byLang = pagesByLangCode[translation.languageCode];
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
    const result = (await response.json()) as {data: FooterType};

    const fetchLink = result.data.global.link;
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
      }
      return "";
    });
    const globalToUse =
      langCode === "en"
        ? result.data.global
        : result.data.global.translations.find(
            (t) => t.languageCode === langCode
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
    const result = (await response.json()) as {data: FooterType};

    const fetchLink = result.data.global.link;
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
      }
      return "";
    });
    const footerToUse =
      langCode === "en"
        ? result.data.global
        : result.data.global.translations.find(
            (t) => t.languageCode === langCode
          ) || result.data.global; //fallback to english if not translation with this langcode;

    return {footerInlineStyles: inlineStyles, footer: footerToUse};
  } catch (error) {
    console.error("footer fetch failed");
    console.error(error);
  }
}
