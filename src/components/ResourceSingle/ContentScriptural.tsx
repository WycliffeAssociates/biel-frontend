import type {ScriptureStoreState} from "@customTypes/types";
import type {domainScripture, RenderedContentRow} from "@src/data/pubDataApi";
import {
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type Resource,
} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {
  changeActiveRow,
  changeActiveRowByUrl,
  fetchHtmlChapters,
  getBoundingRectMenu,
  resourceByBookChap,
  scrollIntoViewIfNeeded,
} from "./lib";
import {ToggleButton} from "@kobalte/core/toggle-button";
import {Select} from "@kobalte/core/select";
import {Accordion} from "@kobalte/core/accordion";
import {Dialog} from "@kobalte/core/dialog";
import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {createMediaQuery} from "@solid-primitives/media";
import {type zipSrcBodyReq} from "@customTypes/types";
import {DownloadOptions} from "./DownloadOptions";

// type ContentType = domainScripture & ScriptureStoreState;
type ContentType = ScriptureStoreState;
type ScripturalViewProps = {
  content: ContentType;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  langDirection: "ltr" | "rtl";
};
export function ScripturalView(props: ScripturalViewProps) {
  // const activeRow = () =>

  const [text, {refetch}] = createResource(
    // when this source signal changes, i.e. the combo of content name changes, and or the active row changes
    () => ({
      name: props.content.name,
      selected:
        props.content.rendered_contents.htmlChapters[
          props.content.activeRowIdx
        ],
    }),
    fetchHtmlChapters,
    {
      ssrLoadFrom: "initial",
    }
  );
  onMount(() => {
    // Deferring fething this from SSR so as to cache in SW as part of call from client. Everything else seems fasts cause we aren't blocking here
    refetch();
  });
  return (
    <div class="flex flex-col gap-4 fullscreen">
      {/* <MenuRow
        setActiveContent={props.setActiveContent}
        langDirection={props.langDirection}
        content={props.content}
        // activeRowIdx={props.content.activeRowIdx}
        // activeRow={activeRow}
      /> */}
      <TextOfResource text={text} />
    </div>
  );
}

type MenuRowProps = {
  content: ContentType;
  // activeRow: () => RenderedContentRow | undefined;
  resourceTypes: () => string[];
  langDirection: "ltr" | "rtl";
  langCode: string;
  fitsScripturalSchema: () => boolean;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  classes?: string;
};
// todo: probably refactor out of being in this file. Can have a menu for for script and non
// todo: some things here are not strictly scriptural vs non scriptraul;
export function MenuRow(props: MenuRowProps) {
  console.log(props.content.gitRepo?.url);
  const zipSrc = (): zipSrcBodyReq => {
    // gateways
    if (props.content.gitRepo?.url) {
      return {
        type: "gateway",
        files: [
          {
            url: props.content.gitRepo.url,
            hash: null,
            size: null,
          },
        ],
      };
    } else {
      return {
        type: "heart",
        files: props.content.rendered_contents.usfmSources.map((s) => ({
          url: s.url,
          hash: s.hash,
          size: s.file_size_bytes,
        })),
      };
      //use rendered src.usfm array
    }
  };

  const activeRow = () =>
    props.content.rendered_contents.htmlChapters[props.content.activeRowIdx];
  return (
    <div class={`flex gap-4 ${props.classes || ""}`}>
      <Show when={props.fitsScripturalSchema()}>
        <Menu
          langCode={props.langCode}
          resourceTypes={props.resourceTypes}
          setActiveContent={props.setActiveContent}
          langDirection={props.langDirection}
          content={props.content}
          fitsScripturalSchema={props.fitsScripturalSchema}
          activeRow={activeRow}
        />

        {/* <DownloadOptions zipSrc={zipSrc} currentContent={props.content} /> */}
        <DownloadOptions
          allContentResourceTypes={props.resourceTypes()}
          currentContent={props.content}
          languageCode={props.langCode}
          zipSrc={zipSrc}
          activeRow={activeRow}
          langDirection={props.langDirection}
        />
      </Show>
    </div>
  );
}

// todo: extrct into own props
type MenuProps = MenuRowProps & {
  activeRow: () => RenderedContentRow | undefined;
};
function Menu(props: MenuProps) {
  // todo: the dialog for desktoip
  const numHtmlChaps = props.content.rendered_contents.htmlChapters.length;
  return (
    <div
      class="flex flex-grow rtl:flex-row-reverse bg-surface-secondary  px-1 py-2 gap-2 md:(rounded-lg)"
      data-js="menuBoundingRect"
      data-css="menuBoundingRect"
    >
      <NavAdjacentButton
        dir="prev"
        langDirection={props.langDirection}
        htmlChaptersLength={numHtmlChaps}
        activeRowIdx={props.content.activeRowIdx}
        setActiveContent={props.setActiveContent}
      />
      <MenuDialog
        activeRow={props.activeRow}
        htmlChapters={props.content.rendered_contents.htmlChapters}
        setActiveContent={props.setActiveContent}
      />
      <NavAdjacentButton
        activeRowIdx={props.content.activeRowIdx}
        dir="next"
        langDirection={props.langDirection}
        htmlChaptersLength={numHtmlChaps}
        setActiveContent={props.setActiveContent}
      />
    </div>
  );
}

type MenuDialogProps = {
  activeRow: () => RenderedContentRow | undefined;
  htmlChapters: RenderedContentRow[];
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
};
function MenuDialog(props: MenuDialogProps) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [boundingMenuRect, setBoundingMenuRect] = createSignal<DOMRect | null>(
    null
  );
  const isBig = createMediaQuery("(min-width: 768px)", true);
  return (
    <div class="relative w-full">
      <Dialog
        open={dialogOpen()}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            getBoundingRectMenu({
              querySelector: "[data-js='menuBoundingRect']",
              setter: setBoundingMenuRect,
            });
          }
          setDialogOpen(isOpen);
          isOpen &&
            scrollIntoViewIfNeeded(
              `[data-accordionbook="${
                props.activeRow()?.scriptural_rendering_metadata.book_name || ""
              }"]`
            );
        }}
      >
        <Dialog.Trigger class="dialog__trigger w-full">
          {props.activeRow()?.scriptural_rendering_metadata.book_name} {""}
          {props.activeRow()?.scriptural_rendering_metadata.chapter}
        </Dialog.Trigger>
        <Dialog.Portal>
          <div
            class="absolute"
            style={{
              top: `${isBig() ? boundingMenuRect()?.top + "px" : "0"}`,
              left: `${isBig() ? boundingMenuRect()?.left + "px" : "0"}`,
              width: `${isBig() ? boundingMenuRect()?.width + "px" : "100vw"}`,
            }}
          >
            <Dialog.Content class="absolute top-0 left-0  max-h-screen md:max-h-70vh min-h-200px overflow-auto bg-white w-full shadow-lg shadow-dark rounded-lg">
              <Dialog.Description class="w-full">
                <Accordion
                  collapsible
                  class="flex flex-col gap-2 px-1 py-1"
                  defaultValue={[
                    props.activeRow()?.scriptural_rendering_metadata
                      .book_name || "",
                  ]}
                >
                  <For
                    each={Object.keys(resourceByBookChap(props.htmlChapters))}
                  >
                    {(bookName) => (
                      <Accordion.Item value={bookName} class={``}>
                        <div class="flex">
                          <Accordion.Trigger class="flex gap-2 bg-surface-secondary w-full justify-between rounded-lg data-[expanded]:(bg-transparent) [&[data-expanded]_span]:rotate-90 px-2 py-3">
                            <Accordion.Header data-accordionbook={bookName}>
                              {bookName}
                            </Accordion.Header>
                            <span
                              class={`ic:round-chevron-left w-1.5em h-1.5em text-onSurface-secondary -rotate-90 `}
                            />
                          </Accordion.Trigger>
                        </div>
                        <Accordion.Content class="flex flex-wrap gap-y-4 accordion-anim-height">
                          <For
                            each={
                              resourceByBookChap(props.htmlChapters)[bookName]
                            }
                          >
                            {(row) => (
                              <button
                                class="w-full text-center flex-grow max-w-13"
                                onClick={() => {
                                  changeActiveRowByUrl({
                                    url: row.url,
                                    htmlChapters: props.htmlChapters,
                                    setter: props.setActiveContent,
                                  });
                                  setDialogOpen(false);
                                }}
                              >
                                {row.scriptural_rendering_metadata.chapter}
                              </button>
                            )}
                          </For>
                        </Accordion.Content>
                      </Accordion.Item>
                    )}
                  </For>
                </Accordion>
              </Dialog.Description>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog>
    </div>
  );
}
type DownloadOptionsProps = {
  // allContent: RenderedContentRow[];
  zipSrc: () => zipSrcBodyReq;
  currentContent: ScriptureStoreState;
};
export function DownloadOptions1(props: DownloadOptionsProps) {
  const defaults = {
    fileType: "PDF",
    includeTranslationsNotes: false,
    includeAllBooks: true,
  };
  const [downloadOptions, setDownloadOptions] = createSignal(defaults);
  const updateDownloadOptions = (
    key: keyof typeof defaults,
    value: (typeof defaults)[keyof typeof defaults]
  ) => {
    setDownloadOptions((p) => {
      return {
        ...p,
        [key]: value,
      };
    });
  };
  // todo: i18n;
  const docCommon = {
    email_address: null,
    assembly_strategy_kind: "lbo",
    layout_for_print: true,
    generate_pdf: false,
    generate_epub: false,
    generate_docx: false,
    resource_requests: [],
    document_request_source: "biel",
    limit_words: false,
  };

  // polling endpoint = https://doc-api.bibleineverylanguage.org/task_status/{task_id}
  // When finished => {"state":"SUCCESS","result":"ceb-ulb-mat_ceb-ulb-mrk_lbo_1c_c_chapter"}

  //
  /*
  Given a lang_code, resource_type, and book_code:
  Common: docx, epub, pdf.
  For Gateway: zip of gitea representation.
  Heart: Fetch zip of source.usfm for each book.
  Scripture app builder?
  */
  return (
    <div class="md:(min-w-20) ">
      <DropdownMenu
        defaultOpen={true}
        gutter={0}
        placement="bottom-end"
        sameWidth={false}
      >
        <DropdownMenu.Trigger class="px-2 py-2 aspect-square md:aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest rounded-lg bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest) focus:(bg-brand-base ring-4 ring-brand ring-offset-6)">
          {/* todo i18n */}
          <span class="i i-ic:baseline-download"></span>
          <span class="hidden md:inline">download</span>
          <span class="i i-mdi:chevron-down hidden md:inline"></span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content class="bg-surface-primary z-10 border-red border-solid relative p-2 rounded-lg shadow-md shadow-dark min-w-80">
            <div class="flex justify-between">
              <h2 class="color-onSurface-primary">Download options</h2>
              <button class="i i-majesticons:close-circle h-6 w-6 bg-onSurface-secondary" />
            </div>
            <div class="flex">
              <Select
                sameWidth={true}
                gutter={0}
                options={["docx", "epub", "pdf", "source"]}
                placeholder="Select a format"
                itemComponent={(props) => (
                  <Select.Item
                    item={props.item}
                    class="flex items-center justify-between hover:(bg-brand-light cursor-pointer)"
                  >
                    <Select.ItemLabel class="w-full data-[selected]:(bg-brand-base text-onSurface-invert)">
                      {props.item.rawValue}
                    </Select.ItemLabel>
                  </Select.Item>
                )}
                class="flex justify-between w-full items-center gap-2"
              >
                <Select.Label class="inline-block shrink-0">
                  File Type
                </Select.Label>
                <Select.Trigger
                  class="bg-surface-secondary border border-solid border-surface-border px-2 py-1 rounded-xl relative inline-flex justify-between items-center w-full"
                  aria-label="Fruit"
                >
                  <Select.Value class="select__value">
                    {/* {(state) => state.selectedOption()} */}
                  </Select.Value>
                  <Select.Icon class="select__icon">
                    <span class="i i-material-symbols:arrow-forward h-6 w-6 " />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content class="bg-surface-primary z-10">
                    <Select.Listbox class="select__listbox" />
                  </Select.Content>
                </Select.Portal>
              </Select>
            </div>
            <div class="flex items-center">
              <p>Inclue Translation Notes</p>
              <ToggleButton class="relative" aria-label="Include tn">
                {(state) => (
                  <div
                    class={`h-5 w-10 rounded-full border-2 border-brand-base px-1 flex items-center ${
                      state.pressed() ? "bg-brand-base" : "bg-surface-primary"
                    }`}
                  >
                    <span
                      class={`i transition-all transform duration-200 ease-in-out absolute w-4  ${
                        state.pressed()
                          ? "i-ic:round-check-circle start-55%  bg-surface-primary"
                          : "i-ic:round-cancel bg-brand-dark start-5%"
                      }`}
                    />
                  </div>
                )}
              </ToggleButton>
            </div>
            <form action="/sw-proxy-zip" method="post">
              <input
                name="zipPayload"
                type="hidden"
                value={JSON.stringify({
                  redirectTo: globalThis.location.href,
                  payload: props.zipSrc(),
                  name: props.currentContent.name,
                })}
              />
              <button
              // onClick={async () => {
              //   const url = "/sw-proxy-zip";
              //   const res = await fetch(url, {
              //     method: "POST",
              //     body: JSON.stringify(props.zipSrc()),
              //   });
              // }}
              >
                Proxy zip SW
              </button>
            </form>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </div>
  );
}

type NavAdjacentButtonProps = {
  dir: "next" | "prev";
  langDirection: "ltr" | "rtl";
  htmlChaptersLength: number;
  activeRowIdx: number;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
};
function NavAdjacentButton(props: NavAdjacentButtonProps) {
  const isDisabled = () => {
    if (props.langDirection === "ltr") {
      if (props.dir === "prev") {
        return props.activeRowIdx === 0;
      } else {
        //ltr next
        return props.activeRowIdx === props.htmlChaptersLength - 1;
      }
    } else {
      if (props.dir === "prev") {
        //rtl prev
        return props.activeRowIdx === props.htmlChaptersLength - 1;
      } else {
        //rtl next
        return props.activeRowIdx === 0;
      }
    }
  };
  const flipForRTLIfNeeded = () => {
    if (props.langDirection === "rtl") {
      if (props.dir === "prev") {
        return "next";
      } else {
        return "prev";
      }
    } else return props.dir;
  };
  const onBtnClick = () => {
    changeActiveRow({
      activeRowIdx: props.activeRowIdx,
      dir: flipForRTLIfNeeded(),
      htmlChaptersLength: props.htmlChaptersLength,
      setter: props.setActiveContent,
    });
  };
  return (
    <Switch>
      <Match when={props.dir === "prev"}>
        <button
          disabled={isDisabled()}
          class="i-ic:round-chevron-left w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
      <Match when={props.dir === "next"}>
        <button
          disabled={isDisabled()}
          class="i-ic:round-chevron-right w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
    </Switch>
  );
}

function TextOfResource(props: {text: Resource<string | null | undefined>}) {
  return (
    <div class="theText max-h-80vh overflow-auto" data-css="theText">
      {/* todo i18n "loading" */}
      <Suspense
        fallback={<div innerHTML={props.text.latest || "Loading..."} />}
      >
        <div class="" innerHTML={props.text() || ""} />
      </Suspense>
    </div>
  );
}
