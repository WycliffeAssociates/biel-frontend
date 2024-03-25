import type {Menu, MenuItem} from "./customTypes/types";
import {DOMParser} from "linkedom";

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
          parent.children = [];
        }
        parent.children.push(item);
      }
    }
  });
  // We attached everythign where it should while in a flat list via references, so now we can get rid of everything except the top layer
  menu.items = menu.items.filter((i) => Number(i.menu_item_parent) == 0);
  // if (menu.items.some((item) => Number(item.menu_item_parent) != 0)) {
  //   return flatMenuToHierachical(menu);
  // }
  return menu;
}

export function adjustCmsDomLinks(stringToParse: string) {
  const wrapped = `<div id="absolutizeWrapper">${stringToParse}</div>`;
  const dom = new DOMParser().parseFromString(wrapped, "text/html");
  const images: HTMLImageElement[] = Array.from(dom.querySelectorAll("img"));
  const baseUrl = import.meta.env.SITE_URL;

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

  replaceAllAbsoluteLinksToCms(dom);
  const wrappedEl: HTMLDivElement | null =
    dom.querySelector("#absolutizeWrapper");
  const contentString = wrappedEl?.innerHTML;
  return contentString || "";
}

function replaceAllAbsoluteLinksToCms(dom: any) {
  const baseUrl = import.meta.env.SITE_URL;
  const allATags: NodeListOf<HTMLAnchorElement> =
    dom.querySelectorAll(`a[href]`);
  // allATags.forEach((t) => console.log(t.href));
  const aTags: NodeListOf<HTMLAnchorElement> = dom.querySelectorAll(
    `a[href^="${baseUrl}"]`
  );
  aTags.forEach((tag) => {
    const newHref = tag.href.replace(baseUrl, "");
    // console.log(`old was ${tag.href}, and new is ${newHref}`);
    tag.setAttribute("href", newHref);
  });
}
