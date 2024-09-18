import {createMediaQuery} from "@solid-primitives/media";
import type {contentsForLang} from "@src/data/pubDataApi";
import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type Setter,
} from "solid-js";
import {isScriptural} from "./lib";
import {createStore, type SetStoreFunction} from "solid-js/store";
import type {ScriptureStoreState, zipSrcBodyReq} from "@customTypes/types";
import type {i18nDict, i18nKeysType} from "@src/i18n/strings";

const ResourceSingleContext = createContext<{
  isBig: () => boolean;
  resourcesSearchTerm: Accessor<string>;
  setResourcesSearchTerm: Setter<string>;
  menuSearchTerm: Accessor<string>;
  setMenuSearchTerm: Setter<string>;
  activeContent: ScriptureStoreState;
  allLangContents: contentsForLang[];
  langCode: string;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  fitsScripturalSchema: () => boolean;
  resourceTypes: () => string[];
  twState: Accessor<{
    menuList:
      | {
          id: string;
          oneWordSlug: string;
        }[]
      | null;
    html: string | null;
    currentWord: {id: string; oneWordSlug: string} | null;
  }>;
  setTwState: Setter<{
    menuList: {id: string; oneWordSlug: string}[] | null;
    html: string | null;
    currentWord: {id: string; oneWordSlug: string} | null;
  }>;
  langDirection: "ltr" | "rtl";
  zipSrc: () => zipSrcBodyReq;
  mobileResourceTitle: () => string;
  i18nDict: i18nDict;
}>();

type ResourceSingleProviderProps = {
  children: any;
  allLangContents: contentsForLang[];
  langDirection: "ltr" | "rtl";
  langCode: string;
  i18nDict: i18nDict;
};
export const ResourceSingleProvider = (props: ResourceSingleProviderProps) => {
  const isBig = createMediaQuery("(min-width: 768px)", true);
  const [resourcesSearchTerm, setResourcesSearchTerm] = createSignal("");
  const [menuSearchTerm, setMenuSearchTerm] = createSignal("");
  const [activeContent, setActiveContent] = createStore<ScriptureStoreState>({
    ...props.allLangContents[0]!,
    activeRowIdx: 0, //points to a row in the rendered_contents array
  });
  const fitsScripturalSchema = () => isScriptural(activeContent);
  const resourceTypes = () => props.allLangContents.map((x) => x.resource_type);
  const [twState, setTwState] = createSignal<{
    menuList: {id: string; oneWordSlug: string}[] | null;
    html: string | null;
    currentWord: {id: string; oneWordSlug: string} | null;
  }>({
    menuList: null,
    html: null,
    currentWord: null,
  });
  const zipSrc = (): zipSrcBodyReq => {
    // gateways
    // I.e. we have a singular github repo we can downloada
    if (activeContent.gitRepo?.url) {
      return {
        type: "gateway",
        files: [
          {
            url: activeContent.gitRepo.url,
            hash: null,
            size: null,
          },
        ],
      };
    } else {
      return {
        type: "heart",
        files: activeContent.rendered_contents.usfmSources.map((s) => ({
          url: s.url,
          hash: s.hash,
          size: s.file_size_bytes,
        })),
      };
      //use rendered src.usfm array
    }
  };

  const mobileResourceTitle = () => {
    if (fitsScripturalSchema()) {
      const activeRow =
        activeContent.rendered_contents.htmlChapters[
          activeContent.activeRowIdx
        ];
      const bookName = activeRow?.scriptural_rendering_metadata.book_name;
      const bookChapter = activeRow?.scriptural_rendering_metadata.chapter;
      let title = `${bookName} ${bookChapter}`;
      return title;
    } else {
      if (!!twState().currentWord) {
        return twState().currentWord?.oneWordSlug || "Translation word";
      } else {
        return "No title";
      }
    }
  };

  return (
    <ResourceSingleContext.Provider
      value={{
        isBig,
        resourcesSearchTerm,
        setResourcesSearchTerm,
        menuSearchTerm,
        setMenuSearchTerm,
        activeContent,
        allLangContents: props.allLangContents,
        langDirection: props.langDirection,
        langCode: props.langCode,
        setActiveContent,
        fitsScripturalSchema,
        resourceTypes,
        twState,
        setTwState,
        zipSrc,
        mobileResourceTitle,
        i18nDict: props.i18nDict,
      }}
    >
      {props.children}
    </ResourceSingleContext.Provider>
  );
};
export const useResourceSingleContext = () => {
  const context = useContext(ResourceSingleContext);
  if (!context) {
    throw new Error(
      "useResourceSingleContext must be used within a ResourceSingleContext"
    );
  }
  return context;
};
