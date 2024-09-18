import type {
  docRequest,
  ScriptureStoreState,
  zipSrcBodyReq,
} from "@customTypes/types";
import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {RadioGroup} from "@kobalte/core/radio-group";
import {ToggleButton} from "@kobalte/core/toggle-button";
import {Dialog} from "@kobalte/core/dialog";
import {createSignal, For, Show, type Accessor, type Setter} from "solid-js";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {type i18nDict} from "@src/i18n/strings";

type DownloadOptionsProps = {};
type DownloadArgs = {
  fileType: "PDF" | "EPUB" | "DOCX" | "SOURCE";
  includeTranslationsNotes: boolean;
  includeAllBooks: boolean;
};

export function DownloadOptions(props: DownloadOptionsProps) {
  const {
    activeContent,
    resourceTypes,
    langDirection,
    langCode,
    isBig,
    zipSrc,
    fitsScripturalSchema,
    i18nDict,
  } = useResourceSingleContext();
  const [isLoading, setIsLoading] = createSignal(false);
  const [abortPoll, setAbortPoll] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [docErred, setDocErred] = createSignal(false);
  const [controller, setController] = createSignal<AbortController>(
    new AbortController()
  );
  const activeRow = () =>
    activeContent.rendered_contents.htmlChapters[activeContent.activeRowIdx];
  const abort = () => {
    setAbortPoll(true);
    controller().abort();
    setIsLoading(false);
    setDocErred(false);
    // resets the controller
    setController(new AbortController());
  };

  const [downloadOptions, setDownloadOptions] = createSignal<DownloadArgs>({
    fileType: "PDF",
    includeTranslationsNotes: false,
    includeAllBooks: false,
  });

  const canShowTn = () =>
    resourceTypes()
      .map((x) => x.toLowerCase())
      .includes("tn") && downloadOptions().fileType !== "SOURCE";
  const doShowAllBooksToggle = () => downloadOptions().fileType !== "SOURCE";

  const updateDownloadOptions = (
    key: keyof DownloadArgs,
    value: DownloadArgs[keyof DownloadArgs]
  ) => {
    setDownloadOptions((p) => {
      return {
        ...p,
        [key]: value,
      };
    });
  };

  const getDocRequestBody = () => {
    let optionsSelected = downloadOptions();
    const basePayload: docRequest = {
      email_address: null,
      assembly_strategy_kind: "lbo",
      layout_for_print: true,
      generate_pdf: false,
      generate_epub: false,
      generate_docx: false,
      resource_requests: [],
      document_request_source: "ui",
      limit_words: false,
    };
    // Set the file Type
    if (optionsSelected.fileType === "PDF") {
      basePayload.generate_pdf = true;
    } else if (optionsSelected.fileType === "EPUB") {
      basePayload.generate_epub = true;
    } else if (optionsSelected.fileType === "DOCX") {
      basePayload.generate_docx = true;
    }
    if (!fitsScripturalSchema()) {
      basePayload.resource_requests = [
        // hard code a single book for like TW
        {
          book_code: "mat",
          lang_code: langCode.toLowerCase(),
          resource_type: activeContent.resource_type.toLowerCase(),
        },
      ];
      basePayload.layout_for_print = false;
    } else {
      // populate the resource_requests
      const allBooksString = new Set(
        activeContent.rendered_contents.htmlChapters.map(
          (c) => c.scriptural_rendering_metadata?.book_slug
        )
      );
      // filter represents toggle btw all and current
      let allBooksPayload = [...allBooksString]
        .filter((bookString) =>
          optionsSelected.includeAllBooks
            ? true
            : bookString ===
              activeRow()?.scriptural_rendering_metadata?.book_slug
        )
        .map((bookSlug) => {
          return {
            lang_code: langCode.toLowerCase(),
            resource_type: activeContent.resource_type.toLowerCase(),
            book_code: bookSlug.toLowerCase(),
          };
        });
      basePayload.resource_requests = [...allBooksPayload];

      // map in a tn for each request if needed
      if (optionsSelected.includeTranslationsNotes && canShowTn()) {
        const allTnResourceRequests = basePayload.resource_requests.map(
          (req) => {
            return {
              ...req,
              resource_type: "tn",
            };
          }
        );
        basePayload.resource_requests = [
          ...basePayload.resource_requests,
          ...allTnResourceRequests,
        ];
      }
    }

    return basePayload;
  };

  const startDownload = async () => {
    const optionsSelected = downloadOptions();
    if (optionsSelected.fileType === "SOURCE") {
      const srcForm = document.querySelector(
        "[data-js='proxy-source-zips']"
      ) as HTMLFormElement;
      if (srcForm) {
        srcForm.submit();
      }
    } else {
      sendDocRequest();
    }
  };

  const sendDocRequest = async () => {
    setIsLoading(true);
    setAbortPoll(false);
    const body = getDocRequestBody();
    try {
      const res = await fetch(`/api/doc`, {
        signal: controller().signal,
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const taskId = await res.text();
      poll(taskId);
    } catch (e) {
      console.error(e);
    }
  };

  const getSuffix = () => {
    const options = downloadOptions();
    switch (options.fileType) {
      case "PDF":
        return "pdf";
      case "EPUB":
        return "epub";
      case "DOCX":
        return "docx";
      default:
        return "";
    }
  };

  async function poll(taskId: string) {
    try {
      console.log(`taskId in poll: ${taskId}`);
      const downloadSuffix = getSuffix();
      const res = await fetch(`/api/pollDoc`, {
        signal: controller().signal,
        method: "POST",
        body: JSON.stringify({taskId: taskId, suffix: downloadSuffix}),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const {state, result} = await res.json();
      if (state === "SUCCESS") {
        const downloadUrl = `https://doc-files.bibleineverylanguage.org/${result}.${downloadSuffix}`;
        const docProxySwATag = document.querySelector(
          "[data-js='proxy-sw-doc']"
        ) as HTMLAnchorElement;
        if (docProxySwATag) {
          docProxySwATag.href = `/api/triggerDownload?url=${encodeURIComponent(
            downloadUrl
          )}&name=${result}.${downloadSuffix}`;
          docProxySwATag.click();
          docProxySwATag.href = "";
        }
        setAbortPoll(true);
        setIsLoading(false);
        setDocErred(false);
      } else if (state === "FAILURE") {
        setDocErred(true);
      }
      if (!abortPoll()) {
        setTimeout(() => poll(taskId), 2000);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setDocErred(true);
      setAbortPoll(true);
    }
  }
  // todo: not here only, but see about splitting some of these out as lazy for page laod speed?
  return (
    <div class="md:(min-w-20)">
      <Show when={isBig()}>
        <DropdownMenu
          open={dialogOpen()}
          gutter={0}
          placement={langDirection === "ltr" ? "bottom-end" : "top-start"}
          sameWidth={false}
        >
          <DropdownMenu.Trigger
            class="p-1 aspect-square bg-brand-light text-brand-base rounded-lg focus:(bg-brand-base ring-4 ring-brand ring-offset-6) md:(aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest  bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest))"
            onClick={() => setDialogOpen(!dialogOpen())}
          >
            <span class="i i-ic:baseline-download w-7 h-5"></span>
            <span class="hidden md:inline">{i18nDict.ls_DownloadButton}</span>
            <span class="i i-mdi:chevron-down hidden md:inline"></span>
          </DropdownMenu.Trigger>
          <DropDownPortal
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            updateDownloadOptions={updateDownloadOptions}
            canShowTn={canShowTn}
            startDownload={startDownload}
            currentContent={activeContent}
            zipSrc={zipSrc}
            doShowAllBooksToggle={doShowAllBooksToggle}
            isLoading={isLoading}
            abort={abort}
            docErred={docErred}
            i18nDict={i18nDict}
          />
        </DropdownMenu>
      </Show>
      <Show when={!isBig()}>
        <DownloadModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          updateDownloadOptions={updateDownloadOptions}
          canShowTn={canShowTn}
          startDownload={startDownload}
          currentContent={activeContent}
          zipSrc={zipSrc}
          doShowAllBooksToggle={doShowAllBooksToggle}
          isLoading={isLoading}
          abort={abort}
          docErred={docErred}
          langDirection={langDirection}
          i18nDict={i18nDict}
        />
      </Show>
    </div>
  );
}

type DropDownPortalProps = {
  dialogOpen: Accessor<boolean>;
  setDialogOpen: Setter<boolean>;
  updateDownloadOptions: (
    key: keyof DownloadArgs,
    value: boolean | "PDF" | "EPUB" | "DOCX" | "SOURCE"
  ) => void;
  canShowTn: () => boolean;
  startDownload: () => Promise<void>;
  currentContent: ScriptureStoreState;
  zipSrc: () => zipSrcBodyReq;
  doShowAllBooksToggle: () => boolean;
  isLoading: Accessor<boolean>;
  abort: () => void;
  docErred: Accessor<boolean>;
  i18nDict: i18nDict;
};
function DropDownPortal(props: DropDownPortalProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        onInteractOutside={() => props.setDialogOpen(false)}
        class="w-min! bg-surface-primary z-10 border border-solid relative p-2 rounded-lg shadow-lg  min-w-70 md:min-w-90  flex flex-col gap-6"
      >
        <div class="flex justify-between">
          <DownloadOptionsTitle i18nDict={props.i18nDict} />
          <CloseButton onClick={props.setDialogOpen} />
        </div>
        <FileTypePicker
          updateDownloadOptions={props.updateDownloadOptions}
          i18nDict={props.i18nDict}
        />
        <Show when={props.canShowTn()}>
          <TranslationNotesToggle
            i18nDict={props.i18nDict}
            updateDownloadOptions={props.updateDownloadOptions}
          />
        </Show>
        <Show when={props.doShowAllBooksToggle()}>
          <IncludeAllBooksToggle
            i18nDict={props.i18nDict}
            updateDownloadOptions={props.updateDownloadOptions}
          />
        </Show>

        <DownloadButton
          i18nDict={props.i18nDict}
          startDownload={props.startDownload}
          isLoading={props.isLoading}
          abort={props.abort}
          docErred={props.docErred}
        />
        <OpenInDocButton i18nDict={props.i18nDict} />
        <a data-js="proxy-sw-doc" class="hidden">
          {props.i18nDict.ls_StartDownlaod}
        </a>
        <HiddenZipSrcForm
          currentContent={props.currentContent}
          zipSrc={props.zipSrc}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

function DownloadModal(
  props: DropDownPortalProps & {
    langDirection: "ltr" | "rtl";
  }
) {
  return (
    <Dialog>
      <Dialog.Trigger
        class="px-2 py-2 aspect-square bg-brand-light text-brand-base rounded-lg focus:(bg-brand-base ring-4 ring-brand ring-offset-6) md:(aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest  bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest))"
        onClick={() => props.setDialogOpen(!props.dialogOpen())}
      >
        <span class="i i-ic:baseline-download w-7 h-5"></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content class="fixed inset-0 z-20 bg-surface-primary p-2 flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <Dialog.CloseButton
              class={`${
                props.langDirection == "ltr"
                  ? "i-material-symbols:arrow-back"
                  : "i-material-symbols:arrow-forward"
              } w-.75em h-.75em font-size-[var(--step-2)]`}
            />
            <Dialog.Title>
              <h2 class="font-size-[var(--step-2)]">
                {props.i18nDict.ls_StartDownlaod}
              </h2>
            </Dialog.Title>
          </div>
          <FileTypePicker
            updateDownloadOptions={props.updateDownloadOptions}
            i18nDict={props.i18nDict}
          />
          <Show when={props.canShowTn()}>
            <TranslationNotesToggle
              i18nDict={props.i18nDict}
              updateDownloadOptions={props.updateDownloadOptions}
            />
          </Show>
          <Show when={props.doShowAllBooksToggle()}>
            <IncludeAllBooksToggle
              i18nDict={props.i18nDict}
              updateDownloadOptions={props.updateDownloadOptions}
            />
          </Show>

          <DownloadButton
            i18nDict={props.i18nDict}
            startDownload={props.startDownload}
            isLoading={props.isLoading}
            abort={props.abort}
            docErred={props.docErred}
          />
          <OpenInDocButton i18nDict={props.i18nDict} />
          <a data-js="proxy-sw-doc" class="hidden">
            {props.i18nDict.ls_StartDownlaod}
          </a>
          <HiddenZipSrcForm
            currentContent={props.currentContent}
            zipSrc={props.zipSrc}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

function DownloadOptionsTitle(props: {i18nDict: i18nDict}) {
  return (
    <h2 class="color-onSurface-primary font-size-[var(--step-1)]">
      {props.i18nDict.ls_DownloadOptionsTitle}
    </h2>
  );
}
function CloseButton(props: {onClick: Setter<boolean>}) {
  return (
    <button
      class="i i-majesticons:close-circle h-6 w-6 bg-onSurface-secondary hover:(bg-error-onSurface!) focus:(bg-error-onSurface!)"
      onClick={() => props.onClick(false)}
    />
  );
}

type FileTypePickerProps = {
  updateDownloadOptions: (
    key: keyof DownloadArgs,
    value: boolean | "PDF" | "EPUB" | "DOCX" | "SOURCE"
  ) => void;
  i18nDict: i18nDict;
};
function FileTypePicker(props: FileTypePickerProps) {
  type OptionType = {value: string; label: string};
  const options = (): OptionType[] => {
    return [
      {value: "PDF", label: "PDF"},
      {value: "EPUB", label: "EPUB"},
      {value: "DOCX", label: "DOCX"},
      {value: "SOURCE", label: props.i18nDict.ls_SourceZipOption},
    ];
  };
  return (
    <RadioGroup
      class="radio-group"
      defaultValue={"PDF"}
      onChange={(v) => {
        props.updateDownloadOptions("fileType", v as DownloadArgs["fileType"]);
      }}
    >
      <RadioGroup.Label class="radio-group__label">
        {props.i18nDict.ls_SelectFormat}
      </RadioGroup.Label>
      <div class="radio-group__items" role="presentation">
        <For each={options()}>
          {(opt) => (
            <RadioGroup.Item
              value={opt.value}
              class="radio flex items-center gap-2 px-2 py-1 rounded-lg data-[checked]:(bg-brand-light)"
            >
              <RadioGroup.ItemInput class="radio__input" />
              <RadioGroup.ItemControl class="h-4 w-4 rounded-full border-onSurface-secondary border-solid border-1 relative data-[checked]:(border-brand-base border-2)">
                <RadioGroup.ItemIndicator class="h-2 w-2 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full  bg-brand-base" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel class="radio__label">
                {opt.label}
              </RadioGroup.ItemLabel>
            </RadioGroup.Item>
          )}
        </For>
      </div>
    </RadioGroup>
  );
}

type ToggleButtonProps = {
  updateDownloadOptions: (
    key: keyof DownloadArgs,
    value: boolean | "PDF" | "EPUB" | "DOCX" | "SOURCE"
  ) => void;
  i18nDict: i18nDict;
};
function TranslationNotesToggle(props: ToggleButtonProps) {
  return (
    <div class="flex items-center justify-between">
      <p>{props.i18nDict.ls_IncludeTranslationNotes}</p>
      <ToggleButton
        class="relative"
        aria-label="Include tn"
        onChange={(pressed) =>
          props.updateDownloadOptions("includeTranslationsNotes", pressed)
        }
      >
        {(state) => <ToggleInterior pressed={state.pressed()} />}
      </ToggleButton>
    </div>
  );
}

function IncludeAllBooksToggle(props: ToggleButtonProps) {
  return (
    <div class="flex items-center justify-between">
      <p>{props.i18nDict.ls_IncludeAllBooks}</p>
      <ToggleButton
        class="relative"
        aria-label="Include tn"
        onChange={(pressed) =>
          props.updateDownloadOptions("includeAllBooks", pressed)
        }
      >
        {(state) => <ToggleInterior pressed={state.pressed()} />}
      </ToggleButton>
    </div>
  );
}

type ToggleInteriorProps = {
  pressed: boolean;
};
function ToggleInterior(props: ToggleInteriorProps) {
  return (
    <div
      class={`h-5 w-10 rounded-full border-2 border-brand-base px-1 flex items-center ${
        props.pressed ? "bg-brand-base" : "bg-surface-primary"
      }`}
    >
      <span
        class={`i transition-all transform duration-200 ease-in-out absolute w-4  ${
          props.pressed
            ? "i-ic:round-check-circle start-55%  bg-surface-primary"
            : "i-ic:round-cancel bg-brand-dark start-5%"
        }`}
      />
    </div>
  );
}

function DownloadButton(props: {
  startDownload: () => void;
  isLoading: Accessor<boolean>;
  abort: () => void;
  docErred: Accessor<boolean>;
  i18nDict: i18nDict;
}) {
  return (
    <div class="w-full flex flex-col gap-4 ">
      <Show when={props.isLoading() && !props.docErred()}>
        <IndeterminateProgress />
        <p class="w-full flex gap-2 items-center text-sm justify-between">
          <span>{props.i18nDict.ls_GeneratingDocMessage}</span>
          <button class="text-brand-base underline" onClick={props.abort}>
            {props.i18nDict.ls_Cancel}
          </button>
        </p>
      </Show>
      <Show when={props.docErred()}>
        <p class="w-full">{props.i18nDict.ls_DocErredMsg}</p>
      </Show>
      <Show when={!props.isLoading()}>
        <button
          onClick={props.startDownload}
          class="px-2 py-1 md:aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest rounded-lg bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest) focus:(bg-brand-base ring-4 ring-brand ring-offset-6) justify-center items-center"
        >
          <span class={` i-mdi:download h-4 w-4`} />
          {props.i18nDict.ls_StartDownlaod}
        </button>
      </Show>
    </div>
  );
}
function OpenInDocButton(props: {i18nDict: i18nDict}) {
  return (
    <a
      href="https://doc.bibleineverylanguage.org"
      data-js="open-in-doc-btn"
      class="text-brand-base inline-flex gap-1 items-center justify-center underline w-max mx-auto"
      target="_blank"
    >
      <span class="i-octicon:link-external-24 w-1em h-1em" />
      {props.i18nDict.ls_OpenInDoc}
    </a>
  );
}

function HiddenZipSrcForm(props: {
  zipSrc: () => zipSrcBodyReq;
  currentContent: ScriptureStoreState;
}) {
  return (
    <form
      class="hidden pointer-events-none"
      tabIndex={-1}
      action="/sw-proxy-zip"
      method="post"
      data-js="proxy-source-zips"
    >
      <input
        name="zipPayload"
        type="hidden"
        value={JSON.stringify({
          redirectTo: globalThis.location.href,
          payload: props.zipSrc(),
          name: props.currentContent.name,
        })}
      />
      {/* submit btn for form. Using form bc we can go through sw for downlaod controls */}
      <button tabIndex={-1}>Proxy zip SW</button>
    </form>
  );
}

function IndeterminateProgress() {
  return (
    <div class="h-2 bg-brand-light w-full overflow-hidden rounded-full">
      <div class="indeterminate-progress rounded-full overflow-hidden w-full h-full bg-brand-base origin-[0_50%]"></div>
    </div>
  );
}
