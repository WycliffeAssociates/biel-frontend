import {Search} from "@components/Search";
import type {languageType} from "@customTypes/types";
import {renderToString} from "solid-js/web";

export function injectSearch({
  langCode,
  langSwitcherList,
}: {
  langCode: string;
  langSwitcherList: languageType[];
}) {
  const renderedSearch = renderToString(
    () => (
      <Search
        isBig={true}
        langCode={langCode}
        injected={true}
        addlClasses="w-full!"
        langSwitcherList={langSwitcherList}
      />
    ),
    {
      renderId: "injectStaticSearch",
    }
  );
  return renderedSearch;
}
