import type {AstroGlobal} from "astro";
import {DOMParser} from "linkedom/worker";
import type {Menu, MenuItem, WpPage, languageType} from "./customTypes/types";
import {bielExternalCacheName} from "@lib/web";

export function flatMenuToHierachical(menu: Menu) {
  // For each menu->items, remove them from the the flat list, find the menu item who is their parent, and add it to children array on the item
  // if there is menu_item_parent, it will match another item's ID property
  const topLevelIdMap = new Map<number, MenuItem>(); // Build map of all menu items by ID

  menu.items.forEach((item) => {
    topLevelIdMap.set(item.ID, item);
  });

  menu.items.forEach((item) => {
    if (Number(item.menu_item_parent) !== 0) {
      const parent = topLevelIdMap.get(Number(item.menu_item_parent));

      if (parent) {
        if (!parent.children) {
          parent.children = {
            featured: [],
            non_featured: [],
          };
        }
        if (item.is_featured) parent.children?.featured.push(item);
        else parent.children?.non_featured.push(item);
      }
    }
  });
  // We have an assumption from design that things will only be in one level, but some will be is_featured and others are not.  On this one level, I want to reduce the menu.items to be featured_items and non_featured_items;

  // We attached everythign where it should while in a flat list via references, so now we can get rid of everything except the top layer
  menu.items = menu.items.filter((i) => Number(i.menu_item_parent) === 0);
  return menu;
}

type adjustCmsDomLinksArgs = {
  stringToParse: string;
  englishUriMap?: Record<string, Record<string, string>>;
  currentLangCode?: string;
  baseUrl?: string;
};

export function adjustCmsDomLinks({
  stringToParse,
  englishUriMap,
  currentLangCode,
  baseUrl,
}: adjustCmsDomLinksArgs) {
  const wrapped = `<div id="absolutizeWrapper">${stringToParse}</div>`;
  const dom = new DOMParser().parseFromString(wrapped, "text/html");
  const images: HTMLImageElement[] = Array.from(dom.querySelectorAll("img"));
  const theBaseUrl = baseUrl ? baseUrl : import.meta.env.CMS_URL;

  images.forEach((img) => {
    const ownServerUrl: string | undefined = theBaseUrl.split("//")?.[1];
    const srcToUse = img.src;
    const srcSet = img.srcset;
    function needToHandleLocalHttpsErr(src: string) {
      return import.meta.env.DEV && ownServerUrl && src.includes(ownServerUrl);
    }
    function isRelativeImgPath(path: string) {
      return path.startsWith("/wp-content");
    }
    // handle relative content paths
    if (needToHandleLocalHttpsErr(img.src) || isRelativeImgPath(img.src)) {
      img.setAttribute("loading", "lazy"); //just assume lazy
      img.setAttribute("src", `${srcToUse}`);
      img.setAttribute("srcset", srcSet.replaceAll(/^http[^s]/g, "https"));
    }
  });

  replaceAllAbsoluteLinksToCms({dom, englishUriMap, currentLangCode});
  const wrappedEl: HTMLDivElement | null =
    dom.querySelector("#absolutizeWrapper");
  const contentString = wrappedEl?.innerHTML;
  return contentString || "";
}

type replaceAllAbsoluteLinksToCms = {
  // biome-ignore lint/suspicious/noExplicitAny: < //it's a dom, but Idk where to grab that type, and linked dom's is bit different.>
  dom: any;
  englishUriMap?: Record<string, Record<string, string>>;
  currentLangCode?: string;
};
function replaceAllAbsoluteLinksToCms({
  dom,
  englishUriMap,
  currentLangCode,
}: replaceAllAbsoluteLinksToCms) {
  const baseUrl = import.meta.env.CMS_URL;
  const theTags = Array.from(
    dom.querySelectorAll("a")
  ) as Array<HTMLAnchorElement>;

  const {resourcePageRelative, baseUrlIncluded} = theTags.reduce(
    (
      acc: {
        resourcePageRelative: Array<HTMLAnchorElement>;
        baseUrlIncluded: Array<HTMLAnchorElement>;
      },
      tag: HTMLAnchorElement
    ) => {
      if (tag.href.includes(baseUrl)) {
        acc.baseUrlIncluded.push(tag);
      } else if (tag.href.includes("/resources/")) {
        acc.resourcePageRelative.push(tag);
      }
      return acc;
    },
    {resourcePageRelative: [], baseUrlIncluded: []}
  );

  const allTags = baseUrlIncluded;
  // const allTags: Array<HTMLAnchorElement> = Array.from(
  //   dom.querySelectorAll(`a[href^="${baseUrl}"]`)
  // );
  const binaryTags = allTags.filter(
    (tag: HTMLAnchorElement) =>
      tag.href.endsWith(".pdf") ||
      tag.href.endsWith(".docx") ||
      tag.href.endsWith(".epub") ||
      tag.href.endsWith(".zip") ||
      tag.href.endsWith(".ppt")
  );
  addDownloadAttrToBinaryTags(binaryTags);
  const aTags = allTags.filter(
    (tag: HTMLAnchorElement) => !binaryTags.includes(tag)
  );

  type MakeUrlArgs = {
    href: string;
    searchParams: URLSearchParams;
    hash: string | null;
  };
  const makeUrl = ({href, searchParams, hash}: MakeUrlArgs) => {
    if (searchParams.size) {
      const withoutTrailingSlash = href.endsWith("/")
        ? href.slice(0, -1)
        : href;

      return encodeURI(
        `${withoutTrailingSlash}?${searchParams.toString().trim()}${
          hash ? `${hash}` : ""
        }`
      );
    }
    return encodeURI(`${href}${hash ? `${hash}` : ""}`);
  };
  resourcePageRelative.forEach((tag) => {
    if (englishUriMap && currentLangCode) {
      const regexMatchHash = tag.href.match(/#(.*)$/);
      const hash = regexMatchHash ? regexMatchHash[0] : null;
      const searchParams = new URLSearchParams(
        tag.href.split("?")?.[1]?.split("#")?.[0]
      );
      const parts = tag.href.split("/").filter((p) => p);
      console.log({parts});
      const langCode = parts.pop()?.split("?")[0];
      const rest = `/${parts.join("/")}/`;
      console.log(`resource page ${tag.href} up until rest ${rest}`);
      // /resources/languages/
      if (englishUriMap[rest]?.[currentLangCode]) {
        const newUrl = makeUrl({
          href: `${englishUriMap[rest]?.[
            currentLangCode
          ]!}/${langCode}`.replaceAll("//", "/"),
          searchParams,
          hash,
        });
        console.log(`setting new url to ${newUrl}`);
        tag.setAttribute("href", newUrl);
      }
    }
  });
  aTags.forEach((tag) => {
    const newHref = tag.href.replace(baseUrl, "");
    tag.setAttribute("href", newHref);
    if (englishUriMap && currentLangCode) {
      // home link, special:
      const regexMatchHash = newHref.match(/#(.*)$/);
      const hash = regexMatchHash ? regexMatchHash[0] : null;
      const searchParams = new URLSearchParams(
        newHref.split("?")?.[1]?.split("#")?.[0]
      );
      let upUntilSearchParams = newHref.split("?")[0]!;
      upUntilSearchParams = upUntilSearchParams.endsWith("/")
        ? upUntilSearchParams
        : `${upUntilSearchParams}/`;

      if (upUntilSearchParams === "/") {
        const newUrl = makeUrl({
          href: `/${currentLangCode}`,
          searchParams,
          hash,
        });
        tag.setAttribute("hash", newUrl);
      } else if (englishUriMap[upUntilSearchParams]?.[currentLangCode]) {
        const newUrl = makeUrl({
          href: englishUriMap[upUntilSearchParams]?.[currentLangCode]!,
          searchParams,
          hash,
        });
        tag.setAttribute("href", newUrl);
      }
    }
  });
}
function addDownloadAttrToBinaryTags(tags: Array<HTMLAnchorElement>) {
  tags.forEach((tag) => tag.setAttribute("download", ""));
}
type OptionalSectionsArg = {
  targetLang: string;
  sectionToAdd:
    | {
        content: string;
        link: string;
        translations: {
          languageCode: string;
          content: string;
        }[];
      }
    | undefined;
};
export function addOptionalSectionsToCmsPages({
  targetLang,
  sectionToAdd,
}: OptionalSectionsArg) {
  let section = null;
  if (sectionToAdd) {
    if (targetLang === "en") {
      section = sectionToAdd;
    } else {
      section =
        sectionToAdd.translations.find((t) => t.languageCode === targetLang) ||
        sectionToAdd;
    }
  }
  return section;
}

type collectInlineStylesArgs = {
  // biome-ignore lint/suspicious/noExplicitAny: <unsure of dom type from linkeddom>
  dom: {querySelector: (arg0: string) => any};
  additionalStyles: Array<string[] | undefined>;
};
export function collectInlineStyles({
  dom,
  additionalStyles,
}: collectInlineStylesArgs) {
  const inlineStyleIds = [
    "generateblocks-inline-css",
    "global-styles-inline-css",
    "generate-style-inline-css",
  ];
  const inlineStyles = inlineStyleIds.map((id) => {
    const styleTag = dom.querySelector(`#${id}`);
    if (styleTag) {
      return styleTag.innerHTML;
    }
    return "";
  });
  if (additionalStyles) {
    additionalStyles.forEach((style) => {
      if (style) {
        inlineStyles.push(...style);
      }
    });
  }
  return inlineStyles;
}

type getNonHiddenPagesArgs = {
  pagesByLangCode: Record<string, Record<string, Omit<WpPage, "translations">>>;
  nonHiddenLanguages: Set<string>;
};
export function getNonHiddenPages({
  nonHiddenLanguages,
  pagesByLangCode,
}: getNonHiddenPagesArgs) {
  const nonHiddenPages = Object.keys(pagesByLangCode).reduce(
    (
      accumulator: Record<string, Record<string, Omit<WpPage, "translations">>>,
      currentLangCode
    ) => {
      const isNotHidden = nonHiddenLanguages.has(currentLangCode);
      if (isNotHidden) {
        // Record<string, Omit<WpPage, "translations">>
        const value = pagesByLangCode[currentLangCode];
        if (value) {
          accumulator[currentLangCode] = value;
        }
      }
      return accumulator;
    },
    {}
  );
  return nonHiddenPages;
}

type getOtherLanguagesPagesListArgs = {
  otherLanguages: {
    [x: string]: Record<string, Omit<WpPage, "translations">>;
  };
  englishPagesDict: Record<string, Omit<WpPage, "translations">>;
};
export function getOtherLanguagesPagesList({
  otherLanguages,
  englishPagesDict,
}: getOtherLanguagesPagesListArgs) {
  const otherLangsList = Object.values(otherLanguages).flatMap((langDict) => {
    const nested = Object.values(langDict).map((translatedPage) => {
      const correspondingEnglishPage =
        englishPagesDict[translatedPage.translationOfId];
      if (correspondingEnglishPage?.inlineStyles) {
        // mutate
        translatedPage.inlineStyles = correspondingEnglishPage.inlineStyles;
      }
      return {pageId: translatedPage.databaseId, page: translatedPage};
    });
    return nested;
  });
  return otherLangsList;
}

/**
 * Determines whether to show the global content based on the page and global parameters.
 *
 * Fxn contains a List of exceptions that shouldnt' have any globals wordpress sections in it (i.e. shared CTA's or contact sections).
 */
export function determineShowGlobal({
  page,
  global,
}: {
  page: WpPage;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  global: Record<string, any> | null | undefined;
}) {
  // maybe opt into wp pages that opt in or out of their globals?
  return !page.isContactPage && !page.isScriptureEngagmentPage && !!global;
}

export function doShowPageTitle(page: WpPage) {
  return (
    !page.isContactPage &&
    !page.isHomePage &&
    !page.isSearchPage &&
    !page.pageOptions?.topBlurb
  );
}

export function isNotCustomPage(page: WpPage) {
  return (
    !page.isSearchPage && !page.isContactPage && !page.isScriptureEngagmentPage
  );
}
export function doShowTopBlurb(page: WpPage) {
  return page.pageOptions?.topBlurb && !page.isHomePage;
}

export const BibleBookCategories = {
  OT: [
    "GEN",
    "EXO",
    "LEV",
    "NUM",
    "DEU",
    "JOS",
    "JDG",
    "RUT",
    "1SA",
    "2SA",
    "1KI",
    "2KI",
    "1CH",
    "2CH",
    "EZR",
    "NEH",
    "EST",
    "JOB",
    "PSA",
    "PRO",
    "ECC",
    "SNG",
    "ISA",
    "JER",
    "LAM",
    "EZK",
    "DAN",
    "HOS",
    "JOL",
    "AMO",
    "OBA",
    "JON",
    "MIC",
    "NAM",
    "HAB",
    "ZEP",
    "HAG",
    "ZEC",
    "MAL",
  ],
  NT: [
    "MAT",
    "MRK",
    "LUK",
    "JHN",
    "ACT",
    "ROM",
    "1CO",
    "2CO",
    "GAL",
    "EPH",
    "PHP",
    "COL",
    "1TH",
    "2TH",
    "1TI",
    "2TI",
    "TIT",
    "PHM",
    "HEB",
    "JAS",
    "1PE",
    "2PE",
    "1JN",
    "2JN",
    "3JN",
    "JUD",
    "REV",
  ],
};
interface sortOrderI {
  [key: string]: number;
}
const bibleBookSortOrder = Object.values(BibleBookCategories)
  .flat()
  .reduce((acc: sortOrderI, value: string, index: number) => {
    acc[value] = index + 1;
    return acc;
  }, {});
export {bibleBookSortOrder};

export function formatBytes(bytes: number) {
  const units = ["bytes", "KB", "MB", "GB"];
  let index = 0;
  let finalBytes = bytes;
  while (finalBytes >= 1000 && index < units.length - 1) {
    finalBytes /= 1000;
    index++;
  }
  return `${Math.round(finalBytes)} ${units[index]}`;
}
export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function hrefLangUrl(version: languageType, astro: AstroGlobal) {
  const hostName = astro.site?.hostname || "";
  if (version.localizedUrl) {
    const withoutStartingSlash = version.localizedUrl.startsWith("/")
      ? version.localizedUrl.slice(1)
      : version.localizedUrl;
    return `${hostName}/${withoutStartingSlash}`;
  }
  if (version.code === "en") {
    return `${hostName}`;
  }
  return `${hostName}/${version.code}`;
}

type TitleCaseArgs = {
  lang: string;
  str: string;
};

export function titleCase({lang = "en", str}: TitleCaseArgs) {
  // function implementation
  const words = Array.from(
    new Intl.Segmenter(lang, {granularity: "word"}).segment(str)
  ).map((word) => word.segment.charAt(0).toUpperCase() + word.segment.slice(1));
  return words.join(" ");
}

export function returnKnownRedirectPathIfKnown(
  reqUrl: URL
): string | undefined {
  const pathName = reqUrl.pathname;
  // const hostName = reqUrl.origin;
  if (pathName.endsWith("/statement-of-faith")) {
    const homeWithHashed = "/#statement-of-faith";
    return homeWithHashed;
  }
}

export async function checkBielExternalCacheForKnownCfErrorTexts() {
  if (!import.meta.env.PROD) return;
  const now = Date.now();
  const lastChecked =
    Number(localStorage.getItem("bielExternalMonitorEpoch")) || now;
  // only if more than 24 hours since last check;
  const oneDayMs = 1000 * 60 * 60 * 24;
  if (lastChecked - oneDayMs < 86400000) return;
  localStorage.setItem("bielExternalMonitorEpoch", now.toString());
  const bielExternalCache = await caches.open(bielExternalCacheName);
  const allReqs = await bielExternalCache.matchAll();
  for await (const req of allReqs) {
    try {
      // tyr to check the body text for cf-error-text:
      const res = await bielExternalCache.match(req.url);
      const xCheckedHeader = req.headers.get("x-biel-checked");
      if (xCheckedHeader) continue; // no need to check again and will only set here:
      if (!res) continue;
      const clone = res.clone();
      const body = await clone.text();
      const errorText = body.includes("challenge-error-text");
      if (errorText) {
        await caches.delete(req.url);
      } else {
        // mark it as checked
        const newHeaders = new Headers(res.headers);
        newHeaders.set("x-biel-checked", "true");
        await bielExternalCache.put(
          req.url,
          new Response(req.body, {
            headers: newHeaders,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
