import type {Menu, MenuItem, WpPage} from "./customTypes/types";
// todo: split this import out somewhere else, cause it's heavy and needs to only be used during build on server
import {DOMParser} from "linkedom/worker";

export function flatMenuToHierachical(menu: Menu) {
  // For each menu->items, remove them from the the flat list, find the menu item who is their parent, and add it to children array on the item
  // if there is menu_item_parent, it will match another item's ID property
  const topLevelIdMap = new Map<number, MenuItem>(); // Build map of all menu items by ID

  menu.items.forEach((item) => {
    topLevelIdMap.set(item.ID, item);
  });

  menu.items.forEach((item) => {
    if (Number(item.menu_item_parent) != 0) {
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
  menu.items = menu.items.filter((i) => Number(i.menu_item_parent) == 0);
  return menu;
}

type adjustCmsDomLinksArgs = {
  stringToParse: string;
  englishUriMap?: Record<string, Record<string, string>>;
  currentLangCode?: string;
};

export function adjustCmsDomLinks(
  stringToParse: string,
  englishUriMap?: Record<string, Record<string, string>>,
  currentLangCode?: string
) {
  const wrapped = `<div id="absolutizeWrapper">${stringToParse}</div>`;
  const dom = new DOMParser().parseFromString(wrapped, "text/html");
  const images: HTMLImageElement[] = Array.from(dom.querySelectorAll("img"));
  const baseUrl = import.meta.env.CMS_URL;

  images.forEach((img) => {
    let ownServerUrl: string | undefined = baseUrl.split("//")?.[1];
    let srcToUse = img.src;
    let srcSet = img.srcset;
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
      img.setAttribute("srcset", srcSet.replaceAll("https", "http"));
    }
  });

  replaceAllAbsoluteLinksToCms(dom, englishUriMap, currentLangCode);
  const wrappedEl: HTMLDivElement | null =
    dom.querySelector("#absolutizeWrapper");
  const contentString = wrappedEl?.innerHTML;
  return contentString || "";
}

// todo: this works, but I'd liek to pass objects all the way down to fix wpml's jankiness with the links, so do that tomorrow.
function replaceAllAbsoluteLinksToCms(
  dom: any,
  englishUriMap?: Record<string, Record<string, string>>,
  currentLangCode?: string
) {
  const baseUrl = import.meta.env.CMS_URL;
  // allATags.forEach((t) => console.log(t.href));
  const aTags: NodeListOf<HTMLAnchorElement> = dom.querySelectorAll(
    `a[href^="${baseUrl}"]`
  );

  // todo: wpml is so jank. I may need to search for absolute, and if it goes to the cms url, then try to replace it with the equivalent in its language on front end
  aTags.forEach((tag) => {
    const newHref = tag.href.replace(baseUrl, "");
    // console.log(`old was ${tag.href}, and new is ${newHref}`);
    tag.setAttribute("href", newHref);
    if (englishUriMap && currentLangCode) {
      console.log(`trying to localized ${newHref} on front end`);
      if (englishUriMap[newHref] && englishUriMap[newHref][currentLangCode]) {
        const localizedHref = englishUriMap[newHref][currentLangCode];
        tag.setAttribute("href", localizedHref);
      }
    }
  });
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
    if (targetLang == "en") {
      section = sectionToAdd;
    } else {
      section =
        sectionToAdd.translations.find((t) => t.languageCode == targetLang) ||
        sectionToAdd;
    }
  }
  return section;
}

type collectInlineStylesArgs = {
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
    } else return "";
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
  const otherLangsList = Object.values(otherLanguages)
    .map((langDict) => {
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
    })
    .flat();
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
  global: Record<string, any> | null | undefined;
}) {
  // maybe opt into wp pages that opt in or out of their globals?
  return !page.isContactPage && !page.isHomePage && !!global;
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
// Generic pipe function with constraints

/* 
This type parameter might need an `extends (x: T) => U` constraint.
*/
