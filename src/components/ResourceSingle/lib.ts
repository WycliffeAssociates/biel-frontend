// Utilites and logic for Resource Singl Pages to keep jsx cleaner

import type {
  contentsForLang,
  domainScripture,
  RenderedContentRow,
} from "@src/data/pubDataApi";
import type {Accessor, Setter} from "solid-js";
import {filter, flow, groupBy} from "ramda";
import type {ScriptureStoreState} from "@customTypes/types";
import type {SetStoreFunction} from "solid-js/store";

export function isScriptural(
  content: contentsForLang
): content is domainScripture {
  return (
    content.domain === "scripture" ||
    content.domain === "gloss" ||
    content.domain === "parascriptural"
  );
}

export const contentContainsSearch = (
  searchTerm: Accessor<string>,
  contents: contentsForLang[]
) => {
  const term = searchTerm().toLowerCase();
  if (!term || term.length <= 1) return contents;
  return contents.filter((content) => {
    const term = searchTerm().toLowerCase();
    return (
      content.name.toLowerCase().includes(term) ||
      content.resource_type.toLowerCase().includes(term)
    );
  });
};

export async function fetchHtmlChapters(arg: {
  selected: RenderedContentRow | undefined;
}) {
  if (!arg.selected) return null;
  try {
    const res = await fetch(
      `${globalThis.origin}/api/fetchExternal?url=${arg.selected.url}&hash=${arg.selected.hash}`
    );
    if (res.ok) {
      const text = await res.text();
      return text;
    } else {
      throw new Error(
        `Error fetching ${arg.selected.url}. Status code: ${res.status}`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

export function hasBookSlug(row: RenderedContentRow) {
  return !!row.scriptural_rendering_metadata.book_slug;
}
export const groupByBookName = (row: RenderedContentRow) =>
  row.scriptural_rendering_metadata.book_name;

const rowsWithBooksNames = (htmlChapters: RenderedContentRow[]) =>
  flow(htmlChapters, [filter(hasBookSlug)]);

export const resourceByBookChap = (htmlChapters: RenderedContentRow[]) =>
  flow(rowsWithBooksNames(htmlChapters), [groupBy(groupByBookName)]);

type changeActiveRowArgs = {
  dir: "next" | "prev";
  setter: SetStoreFunction<ScriptureStoreState>;
  activeRowIdx: number;
  htmlChaptersLength: number;
};
export const changeActiveRow = ({
  dir,
  setter,
  activeRowIdx,
  htmlChaptersLength,
}: changeActiveRowArgs) => {
  if (dir === "next" && activeRowIdx < htmlChaptersLength - 1) {
    setter("activeRowIdx", activeRowIdx + 1);
  } else if (activeRowIdx != 0) {
    setter("activeRowIdx", activeRowIdx - 1);
  }
};
// needed to position dialog overlapping trigger

export const getBoundingRectMenu = ({
  querySelector,
  setter,
}: {
  querySelector: string;
  setter: Setter<DOMRect | null>;
}) => {
  const el = document.querySelector(querySelector);
  if (!el) return null;
  setter(el.getBoundingClientRect());
};

export const scrollIntoViewIfNeeded = (querySelector: string) => {
  const el = document.querySelector(querySelector) as HTMLElement;
  if (el) {
    setTimeout(() => {
      el.scrollIntoView({behavior: "smooth", inline: "start"});
    }, 100);
  }
};

type changeActiveRowByUrlArgs = {
  url: string;
  htmlChapters: RenderedContentRow[];
  setter: SetStoreFunction<ScriptureStoreState>;
};
export const changeActiveRowByUrl = ({
  url,
  htmlChapters,
  setter,
}: changeActiveRowByUrlArgs) => {
  const rowIdx = htmlChapters.findIndex((row) => row.url === url);
  if (rowIdx > -1) {
    setter("activeRowIdx", rowIdx);
  }
};
