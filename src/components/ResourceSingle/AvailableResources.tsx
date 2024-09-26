import type {ScriptureStoreState, TsFile} from "@customTypes/types";
import {Dialog} from "@kobalte/core/dialog";
import type {contentsForLang} from "@src/data/pubDataApi";
import {For, Show, createSignal} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {DownloadOptions} from "./DownloadOptions";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {contentContainsSearch, isScriptural} from "./lib";

type AvailableResourcesProps = {
  classes?: string;
  tsFiles: TsFile[] | undefined;
};
// todo: this is likely just gonna be "big", and have a separate export for small
export function AvailableResources(props: AvailableResourcesProps) {
  const {
    isBig,
    setActiveContent,
    activeContent,
    menuSearchTerm,
    allLangContents,
    i18nDict,
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

        <Show when={props.tsFiles?.length}>
          <hr class="border-none h-2px text-[#e6e6e6] bg-[#e6e6e6]" />
          <div>
            <h3 class="text-brand-dark font-bold pis-2">
              {i18nDict.ls_AvailableForDownload}
            </h3>
            <ul>
              <For each={props.tsFiles}>
                {(row) => <TsFileDownload tsFile={row} />}
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
  } = useResourceSingleContext();

  return (
    <div
      class={`flex flex-col w-max mx-auto gap-1 items-center ${
        props.classes || ""
      }`}
    >
      <h2 class="font-size-[var(--step-1)]">{mobileResourceTitle()}</h2>
      <Dialog open={open()} onOpenChange={setOpen}>
        <Dialog.Trigger
          data-name="mobile-resource-changer"
          // todo: fix this to match figma
          class={
            "underline uppercase relative inline-flex justify-between items-center  ps-2 text-start font-size-[var(--step-0)]"
          }
        >
          {activeContent.resource_type}
          <span class="i-ic:round-arrow-drop-down" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <div class="absolute inset-0 w-full h-screen bg-surface-primary px-4 py-4">
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
      {/* todo: maybeexternalize icons into other file for consistency */}
      <span class="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 i-ph:magnifying-glass" />
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
          isSelected() ? "bg-brand-light text-brand-base" : ""
        }`}
      >
        {props.content.title || props.content.name}
        <span class="i-material-symbols:arrow-right-alt-rounded rtl:rotate-180 md:(hidden)" />
      </button>
    </li>
  );
}

function TsFileDownload(props: {tsFile: TsFile}) {
  // todo: Thomas change to think of only using url for whole repo and not each folder
  const [category, {files}] = props.tsFile;
  // https://raw.githubusercontent.com/wkelly17/biel-tk-example/master/en/docx.docx
  const formPayload = {
    payload: files,
    name: category,
  };
  return (
    <div class="flex justify-between w-full p-2">
      {category}
      <form
        action="/sw-proxy-ts"
        method="post"
        class=""
        data-js={`proxy-ts-${category}`}
      >
        <input
          type="hidden"
          value={JSON.stringify(formPayload)}
          name="zipPayload"
        />
      </form>
      <button
        type="button"
        class="hover:(text-brand-base)"
        onClick={(e) => {
          // note: I don't know why progrmamatic submission of form trigger octect stream downloads but not just clicking the bnt.  They are just different Took me forever to chase down it even does this, much less why? Might have to waitUntil in sw, but this works so sticking with it even if clunky
          const form = document.querySelector(
            `[data-js="proxy-ts-${category}"]`
          ) as HTMLFormElement;
          if (form) form.submit();
        }}
      >
        <span class="i-ic:round-file-download w-4 h-4" />
      </button>
    </div>
  );
}
