import type {
  ContentListingProps,
  ScriptureStoreState,
  TsDirectoryFile,
  TsDirectoryLang,
  ZipSrcBodyReq,
} from "@customTypes/types";
import {createMediaQuery} from "@solid-primitives/media";
import type {ContentsForLang} from "@src/data/gqlQueries/queries";
import type {i18nDictType} from "@src/i18n/strings";
import {
  type Accessor,
  type Setter,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import {type SetStoreFunction, createStore} from "solid-js/store";
import {fetchHtmlChapters, isScriptural} from "./lib";
import {constants} from "@lib/constants";

const ResourceSingleContext = createContext<{
  isBig: () => boolean;
  resourcesSearchTerm: Accessor<string>;
  setResourcesSearchTerm: Setter<string>;
  menuSearchTerm: Accessor<string>;
  setMenuSearchTerm: Setter<string>;
  activeContent: ScriptureStoreState;
  allLangContents: ContentsForLang[];
  langCode: string;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  fitsScripturalSchema: () => boolean;
  resourceTypes: () => string[];
  twState: Accessor<twStateType>;
  setTwState: Setter<twStateType>;
  langDirection: "ltr" | "rtl";
  zipSrc: () => ZipSrcBodyReq;
  mobileResourceTitle: () => string;
  i18nDict: i18nDictType;
  langEnglishName: string;
  docUiUrl: string;
  prefetchAdjacent: (dir: "next" | "prev") => void;
  viewType: Accessor<"readable" | "downloadable">;
  setViewType: Setter<"readable" | "downloadable">;
  selectedTsFolder: Accessor<tsFolderState | undefined>;
  setSelectedTsFolder: Setter<tsFolderState | undefined>;
  tsFilesForDownload: Accessor<TsFilesForDownload>;
  setTsFilesForDownload: Setter<TsFilesForDownload>;
  downloadableSearchTerm: Accessor<string>;
  setDownloadableSearchTerm: Setter<string>;
  allTsFiles:
    | {
        trainingFiles: TsDirectoryLang | undefined;
        supplementalFiles: TsDirectoryLang | undefined;
      }
    | undefined;
}>();
export type tsFolderState = {
  folderName: string;
  subTree: TsDirectoryLang;
};
export type TsFilesForDownload = Map<string, TsDirectoryFile>;
export type twStateType = {
  menuList:
    | {
        id: string;
        oneWordSlug: string;
      }[]
    | null;
  html: string | null;
  currentWord: {id: string; oneWordSlug: string} | null;
};

type ResourceSingleProviderProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <I think children have to be jsx els or something, but not going to pass a type that's not that of course>
  children: any;
  allLangContents: ContentsForLang[];
  langDirection: "ltr" | "rtl";
  langCode: string;
  i18nDict: i18nDictType;
  queryParams: ContentListingProps["queryParams"];
  englishName: string;
  docUiUrl: string;
  tsFiles:
    | {
        trainingFiles: TsDirectoryLang | undefined;
        supplementalFiles: TsDirectoryLang | undefined;
      }
    | undefined;
};
export const ResourceSingleProvider = (props: ResourceSingleProviderProps) => {
  const isBig = createMediaQuery("(min-width: 768px)", true);
  const [resourcesSearchTerm, setResourcesSearchTerm] = createSignal("");
  const [menuSearchTerm, setMenuSearchTerm] = createSignal("");
  const [downloadableSearchTerm, setDownloadableSearchTerm] = createSignal("");
  const [viewType, setViewType] = createSignal<"readable" | "downloadable">(
    props.queryParams.download ? "downloadable" : "readable"
  );
  function getDefaultTsFolderShown() {
    if (!props.tsFiles?.trainingFiles || !props.queryParams.download) return;
    const def = props.tsFiles.trainingFiles.folders[props.queryParams.download];
    if (!def) return;
    return {
      folderName: props.queryParams.download,
      subTree: def,
    };
  }
  const [selectedTsFolder, setSelectedTsFolder] = createSignal<
    tsFolderState | undefined
  >(getDefaultTsFolderShown());

  const [tsFilesForDownload, setTsFilesForDownload] =
    createSignal<TsFilesForDownload>(new Map());

  const resourceFromQpOrDefault =
    props.allLangContents.find((r) => r.name === props.queryParams.resource) ||
    props.allLangContents[0]!;

  let activeRowIdxFromQpOrDefault =
    resourceFromQpOrDefault.rendered_contents.htmlChapters.findIndex((chap) => {
      if (props.queryParams.chapter && props.queryParams.book) {
        return (
          chap.scriptural_rendering_metadata?.book_slug.toUpperCase() ===
            props.queryParams.book.toUpperCase() &&
          String(chap.scriptural_rendering_metadata?.chapter) ===
            String(props.queryParams.chapter)
        );
      }
      if (props.queryParams.book) {
        return (
          chap.scriptural_rendering_metadata?.book_slug.toUpperCase() ===
          props.queryParams.book.toUpperCase()
        );
      }
      if (props.queryParams.chapter) {
        return (
          String(chap.scriptural_rendering_metadata?.chapter) ===
          String(props.queryParams.chapter)
        );
      }
      return 0;
    });
  // fallback to default if branch above resulted in a not found.. i.e. invalid book or chapter
  activeRowIdxFromQpOrDefault =
    activeRowIdxFromQpOrDefault === -1 ? 0 : activeRowIdxFromQpOrDefault;
  const [activeContent, setActiveContent] = createStore<ScriptureStoreState>({
    ...resourceFromQpOrDefault,
    activeRowIdx: activeRowIdxFromQpOrDefault, //points to a row in the rendered_contents array
  });
  const fitsScripturalSchema = () => isScriptural(activeContent);
  const resourceTypes = () => props.allLangContents.map((x) => x.resource_type);
  const [twState, setTwState] = createSignal<twStateType>({
    menuList: null,
    html: null,
    currentWord: null,
  });
  const zipSrc = (): ZipSrcBodyReq => {
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
    }
    return {
      type: "heart",
      files: activeContent.rendered_contents.usfmSources.map((s) => ({
        url: s.url,
        hash: s.hash,
        size: s.file_size_bytes,
      })),
    };
    //use rendered src.usfm array
  };

  const prefetchAdjacent = (dir: "next" | "prev") => {
    if (fitsScripturalSchema()) {
      if (
        dir === "next" &&
        activeContent.activeRowIdx <
          activeContent.rendered_contents.htmlChapters.length - 1
      ) {
        const nextRow =
          activeContent.rendered_contents.htmlChapters[
            activeContent.activeRowIdx + 1
          ];
        fetchHtmlChapters({selected: nextRow});
      } else if (dir === "prev" && activeContent.activeRowIdx !== 0) {
        const prevRow =
          activeContent.rendered_contents.htmlChapters[
            activeContent.activeRowIdx - 1
          ];
        fetchHtmlChapters({selected: prevRow});
      }
    }
  };

  const mobileResourceTitle = () => {
    if (fitsScripturalSchema()) {
      const activeRow =
        activeContent.rendered_contents.htmlChapters[
          activeContent.activeRowIdx
        ];
      const bookName = activeRow?.scriptural_rendering_metadata?.book_name;
      const bookChapter = activeRow?.scriptural_rendering_metadata?.chapter;
      const title = `${bookName} ${bookChapter}`;
      return title;
    }
    if (twState().currentWord) {
      return twState().currentWord?.oneWordSlug || "Translation word";
    }
    return "No title";
  };

  createEffect(() => {
    if (!import.meta.env.SSR) {
      let baseUrl = `${window.location.origin}${window.location.pathname}?${constants.queryParamResourceType}=${activeContent.name}`;
      const currentRow =
        activeContent.rendered_contents?.htmlChapters[
          activeContent.activeRowIdx
        ];
      if (currentRow) {
        const bookSlug = currentRow.scriptural_rendering_metadata?.book_slug;
        const bookChapter = currentRow.scriptural_rendering_metadata?.chapter;
        if (bookSlug) baseUrl += `&book=${bookSlug}`;
        if (bookChapter) baseUrl += `&chapter=${bookChapter}`;
      }
      window.history.replaceState(null, "", baseUrl);
    }
  });

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
        langEnglishName: props.englishName,
        docUiUrl: props.docUiUrl,
        prefetchAdjacent,
        viewType,
        setViewType,
        selectedTsFolder: selectedTsFolder,
        setSelectedTsFolder: setSelectedTsFolder,
        setTsFilesForDownload,
        tsFilesForDownload,
        downloadableSearchTerm,
        setDownloadableSearchTerm,
        allTsFiles: props.tsFiles,
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
