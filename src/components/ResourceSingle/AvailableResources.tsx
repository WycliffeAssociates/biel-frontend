import type {contentsForLang} from "@src/data/pubDataApi";
import {createSignal, For, Show} from "solid-js";
import {contentContainsSearch, isScriptural} from "./lib";
import type {SetStoreFunction} from "solid-js/store";
import type {ScriptureStoreState, tsFile} from "@customTypes/types";
import {Dialog} from "@kobalte/core/dialog";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {DownloadOptions} from "./DownloadOptions";

type AvailableResourcesProps = {
  classes?: string;
  tsFiles: tsFile[] | undefined;
};
// todo: this is likely just gonna be "big", and have a separate export for small
export function AvailableResources(props: AvailableResourcesProps) {
  const {
    isBig,
    setActiveContent,
    activeContent,
    menuSearchTerm,
    allLangContents,
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
                setActiveContent={setActiveContent}
                content={row}
                activeContent={activeContent}
              />
            )}
          </For>
        </ul>
        <ul>
          <For each={props.tsFiles}>
            {(row) => <TsFileDownload tsFile={row} />}
          </For>
        </ul>
      </div>
    </Show>
  );
}
function AvailableResourcesSmall(props: AvailableResourcesProps) {
  const [open, setOpen] = createSignal(true);
  const {setActiveContent, activeContent, menuSearchTerm, allLangContents} =
    useResourceSingleContext();

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <Dialog.Trigger
        class={`bg-red-100 relative inline-flex justify-between items-center rounded-s-lg ps-2 text-start ${
          props.classes || ""
        }`}
      >
        {activeContent.resource_type}
        <span class="i-ic:round-arrow-drop-down" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <div class="absolute inset-0 w-full h-screen bg-surface-primary px-4 py-4">
          <div class="flex w-full justify-between items-center">
            <Dialog.Title class="text-3xl inline-flex items-center gap-4">
              {/* todo i18n */}
              <button
                class="i-ic:round-arrow-back rtl:rotate-180 w-.75em h-.75em bg-onSurface-secondary!"
                onClick={() => setOpen(false)}
              />
              Resource Type
            </Dialog.Title>
            <DownloadOptions />
          </div>
          <SearchBar classes="my-4" />

          <ul class="">
            <For each={contentContainsSearch(menuSearchTerm, allLangContents)}>
              {(row) => (
                <AvailableResource
                  setActiveContent={setActiveContent}
                  content={row}
                  activeContent={activeContent}
                  additionalOnClick={() => setOpen(false)}
                />
              )}
            </For>
          </ul>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}

type SearchBarProps = {
  classes?: string;
};
export function SearchBar(props: SearchBarProps) {
  const {setMenuSearchTerm} = useResourceSingleContext();

  return (
    <div class={`relative ${props.classes || ""}`}>
      <input
        type="text"
        // todo i18n
        placeholder="Search..."
        class="bg-surface-secondary px-6 py-2 rounded-lg w-full border border-surface-border"
        onInput={(e) => setMenuSearchTerm(e.currentTarget.value)}
      />
      <span class="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 i-ph:magnifying-glass"></span>
    </div>
  );
}

type AvailableResourceProps = {
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  content: contentsForLang;
  activeContent: ScriptureStoreState;
  additionalOnClick?: () => void;
};
export function AvailableResource(props: AvailableResourceProps) {
  const isSelected = () => {
    return props.content.name === props.activeContent.name;
  };
  function setContent() {
    // props.setActiveContent(props.content);
    props.setActiveContent((prev) => {
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
              row.scriptural_rendering_metadata.book_slug ===
                currentRow.scriptural_rendering_metadata.book_slug &&
              row.scriptural_rendering_metadata.chapter ===
                currentRow.scriptural_rendering_metadata.chapter
          );
        if (equivalent > -1) {
          newState.activeRowIdx = equivalent;
          return newState;
        } else return newState;
      } else return newState;
    });
  }
  return (
    <li>
      <button
        data-name={props.content.name}
        onClick={() => {
          setContent();
          if (props.additionalOnClick) props.additionalOnClick();
        }}
        class={`w-full text-left p-2  rounded-lg inline-flex justify-between hover:bg-brand-light ${
          isSelected() ? "bg-brand-light text-brand-base" : ""
        }`}
      >
        {props.content.name}
        <span class="i-material-symbols:arrow-right-alt-rounded rtl:rotate-180 md:(hidden)" />
      </button>
    </li>
  );
}

function TsFileDownload(props: {tsFile: tsFile}) {
  // todo: Thomas change to think of only using url for whole repo and not each folder
  const [category, {url, files}] = props.tsFile;
  // https://raw.githubusercontent.com/wkelly17/biel-tk-example/master/en/docx.docx
  const formPayload = {
    payload: files,
    name: category,
  };
  return (
    <div class="flex justify-between w-full">
      {category}
      <form action="/ts-zip-files" method="post">
        <input
          type="hidden"
          value={JSON.stringify(formPayload)}
          name="zipPayload"
        />
        <button>
          <span class="i-ic:round-file-download w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
