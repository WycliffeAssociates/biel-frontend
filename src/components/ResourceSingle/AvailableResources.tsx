import type {
  ScriptureStoreState,
  TsDirectoryLang,
  TsFile,
} from "@customTypes/types";
import {Dialog} from "@kobalte/core/dialog";
import type {contentsForLang} from "@src/data/pubDataApi";
import {For, Show, createSignal, type Accessor, type Setter} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {DownloadOptions} from "./DownloadOptions";
import {
  useResourceSingleContext,
  type tsFolderState,
} from "./ResourceSingleContext";
import {contentContainsSearch, isScriptural} from "./lib";
import {getTsFilesPayload} from "@lib/web";
import type {tsFilesToDownload} from "./ResourceSingleContext";
import {formatBytes} from "@src/utils";

type AvailableResourcesProps = {
  classes?: string;
  tsFiles: TsDirectoryLang | undefined;
};
export function AvailableResources(props: AvailableResourcesProps) {
  const {
    isBig,
    setActiveContent,
    activeContent,
    menuSearchTerm,
    allLangContents,
    i18nDict,
    setTsFolders,
    setViewType,
    tsFolders,
    viewType,
  } = useResourceSingleContext();

  return (
    <Show when={isBig()} fallback={<AvailableResourcesSmall {...props} />}>
      <div
        class={`hidden md:(flex shrink-0 flex-col gap-2) ${
          props.classes || ""
        }`}
      >
        <ul class="flex flex-col gap-4">
          <For each={contentContainsSearch(menuSearchTerm, allLangContents)}>
            {(row) => (
              <AvailableResource
                setViewType={setViewType}
                setActiveContent={setActiveContent}
                content={row}
                activeContent={activeContent}
                viewType={viewType}
              />
            )}
          </For>
        </ul>

        <Show when={props.tsFiles}>
          <hr class="border-none h-2px text-[#e6e6e6] bg-[#e6e6e6]" />
          <div>
            <h3 class="text-brand-dark font-700 font-step-0 mbe-2">
              {i18nDict.ls_AvailableForDownload}
            </h3>
            <ul class="flex flex-col gap-4">
              <For each={Object.entries(props.tsFiles!.folders)}>
                {([key, value]) => (
                  <TsFileDownload
                    tsFolders={tsFolders}
                    setViewType={setViewType}
                    setTsFolders={setTsFolders}
                    topLevelFolder={key}
                    subTree={value}
                    viewType={viewType}
                  />
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </Show>
  );
}
function AvailableResourcesSmall(props: AvailableResourcesProps) {
  const [open, setOpen] = createSignal(false);
  const {
    setActiveContent,
    activeContent,
    menuSearchTerm,
    allLangContents,
    mobileResourceTitle,
    i18nDict,
    setViewType,
    setTsFolders,
    viewType,
    tsFolders,
    tsFilesToDownload,
  } = useResourceSingleContext();

  return (
    <div
      class={`flex flex-col w-full sticky top-0 bg-surface-primary mx-auto gap-4 items-center z-5 ${
        props.classes || ""
      }`}
    >
      <Show when={viewType() === "readable"}>
        <h2 class="font-size-[var(--step-1)]">{mobileResourceTitle()}</h2>
      </Show>
      <Dialog open={open()} onOpenChange={setOpen}>
        <Dialog.Trigger
          data-name="mobile-resource-changer"
          class={
            "underline uppercase relative inline-flex justify-between items-center  ps-2 text-start font-size-[var(--step-0)]"
          }
        >
          {viewType() === "readable"
            ? activeContent.displayName
            : tsFolders()?.folderName}
          <span class="i-ic:round-arrow-drop-down" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <div class="absolute inset-0 w-full h-screen bg-surface-primary px-4 py-4 z-10">
            <div class="flex w-full justify-between items-center">
              <Dialog.Title class="text-3xl inline-flex items-center gap-4">
                <button
                  type="button"
                  class="i-ic:round-arrow-back rtl:rotate-180 w-.75em h-.75em bg-onSurface-secondary!"
                  onClick={() => setOpen(false)}
                />
                {i18nDict.ls_ResourceType}
              </Dialog.Title>
              <DownloadOptions />
            </div>
            <SearchBar classes="my-4" />

            <ul class="">
              <For
                each={contentContainsSearch(menuSearchTerm, allLangContents)}
              >
                {(row) => (
                  <AvailableResource
                    setViewType={setViewType}
                    setActiveContent={setActiveContent}
                    content={row}
                    activeContent={activeContent}
                    additionalOnClick={() => setOpen(false)}
                    viewType={viewType}
                  />
                )}
              </For>
            </ul>
            <Show when={props.tsFiles}>
              <hr class="border-none h-2px text-[#e6e6e6] bg-[#e6e6e6]" />
              <div>
                <h3 class="text-brand-dark font-bold pis-2">
                  {i18nDict.ls_AvailableForDownload}
                </h3>
                <ul>
                  <For each={Object.entries(props.tsFiles!.folders)}>
                    {([key, value]) => (
                      <TsFileDownload
                        tsFolders={tsFolders}
                        setViewType={setViewType}
                        setTsFolders={setTsFolders}
                        topLevelFolder={key}
                        subTree={value}
                        additionalOnClick={() => setOpen(false)}
                        viewType={viewType}
                      />
                    )}
                  </For>
                </ul>
              </div>
            </Show>
          </div>
        </Dialog.Portal>
      </Dialog>
      <Show when={viewType() === "downloadable" && !open()}>
        <form action="/api/downloadTsFiles" method="post">
          <label class="flex gap-2 items-center">
            <input
              type="hidden"
              name="zipPayload"
              value={JSON.stringify(
                getTsFilesPayload(Array.from(tsFilesToDownload())).zipPayload
              )}
            />
            <button
              type="submit"
              class="fixed bottom-4 end-4 p-2 bg-brand-light text-brand-base rounded-xl focus:(bg-brand-base ring-4 ring-offset-6) hover:(bg-brand-base text-onSurface-invert)  "
            >
              {i18nDict.ls_DownloadButton}
              {i18nDict.ls_DownloadButton}{" "}
              {`(${formatBytes(
                getTsFilesPayload(Array.from(tsFilesToDownload())).size
              )})`}
            </button>
          </label>
        </form>
      </Show>
    </div>
  );
}

type SearchBarProps = {
  classes?: string;
};
export function SearchBar(props: SearchBarProps) {
  const {setMenuSearchTerm, i18nDict} = useResourceSingleContext();

  return (
    <div class={`relative ${props.classes || ""}`}>
      <input
        type="text"
        placeholder={i18nDict.search}
        class="bg-surface-secondary px-6 py-2 rounded-lg w-full border border-surface-border"
        onInput={(e) => setMenuSearchTerm(e.currentTarget.value)}
      />
      <span class="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 i-ph:magnifying-glass" />
    </div>
  );
}

type AvailableResourceProps = {
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  content: contentsForLang;
  activeContent: ScriptureStoreState;
  additionalOnClick?: () => void;
  setViewType: Setter<"readable" | "downloadable">;
  viewType: () => "readable" | "downloadable";
};
export function AvailableResource(props: AvailableResourceProps) {
  const isSelected = () => {
    return props.content.name === props.activeContent.name;
  };
  function setContent() {
    props.setActiveContent((prev) => {
      props.setViewType("readable");
      const newState = {
        ...props.content,
        activeRowIdx: 0,
      };
      if (isScriptural(prev) && isScriptural(props.content)) {
        const currentRow =
          prev.rendered_contents.htmlChapters[prev.activeRowIdx];
        if (!currentRow) return newState;
        const equivalent =
          props.content.rendered_contents.htmlChapters.findIndex(
            (row) =>
              row.scriptural_rendering_metadata?.book_slug ===
                currentRow.scriptural_rendering_metadata?.book_slug &&
              row.scriptural_rendering_metadata?.chapter ===
                currentRow.scriptural_rendering_metadata?.chapter
          );
        if (equivalent > -1) {
          newState.activeRowIdx = equivalent;
          return newState;
        }
        return newState;
      }
      return newState;
    });
  }
  return (
    <li>
      <button
        type="button"
        data-name={props.content.name}
        onClick={() => {
          setContent();
          if (props.additionalOnClick) props.additionalOnClick();
        }}
        class={`w-full text-left p-2  rounded-lg inline-flex justify-between hover:bg-brand-light ${
          isSelected() && props.viewType() === "readable"
            ? "bg-brand-light! text-brand-base!"
            : ""
        }`}
      >
        {props.content.displayName || props.content.title || props.content.name}
        <span class="i-material-symbols:arrow-right-alt-rounded rtl:rotate-180 md:(hidden)" />
      </button>
    </li>
  );
}

function TsFileDownload(props: {
  topLevelFolder: string;
  subTree: TsDirectoryLang;
  setTsFolders: Setter<
    | {
        folderName: string;
        subTree: TsDirectoryLang;
      }
    | undefined
  >;
  tsFolders: Accessor<tsFolderState | undefined>;
  setViewType: Setter<"readable" | "downloadable">;
  additionalOnClick?: () => void;
  viewType: () => "readable" | "downloadable";
}) {
  return (
    <li>
      <button
        class={`text-left p-2  rounded-lg inline-flex justify-between hover:bg-brand-light ${
          props.tsFolders()?.folderName === props.topLevelFolder &&
          props.viewType() === "downloadable"
            ? "bg-brand-light! text-brand-base!"
            : ""
        } `}
        onClick={() => {
          props.setTsFolders({
            folderName: props.topLevelFolder,
            subTree: props.subTree,
          });
          props.setViewType("downloadable");
          window.history.replaceState(
            null,
            "",
            `?download=${props.topLevelFolder}`
          );
          if (props.additionalOnClick) props.additionalOnClick();
        }}
        type="button"
      >
        {props.topLevelFolder}
      </button>
    </li>
  );
}
