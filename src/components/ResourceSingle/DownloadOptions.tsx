import type {
  docRequest,
  ScriptureStoreState,
  zipSrcBodyReq,
} from "@customTypes/types";
import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {Select} from "@kobalte/core/select";
import {ToggleButton} from "@kobalte/core/toggle-button";
import {Progress} from "@kobalte/core/progress";
import type {RenderedContentRow} from "@src/data/pubDataApi";
import {createSignal, Show, type Accessor, type Setter} from "solid-js";

type DownloadOptionsProps = {
  // allContent: RenderedContentRow[];
  zipSrc: () => zipSrcBodyReq;
  currentContent: ScriptureStoreState;
  languageCode: string;
  allContentResourceTypes: string[];
  activeRow: () => RenderedContentRow | undefined;
  langDirection: "ltr" | "rtl";
};
type DownloadArgs = {
  fileType: "PDF" | "EPUB" | "DOCX" | "SOURCE";
  includeTranslationsNotes: boolean;
  includeAllBooks: boolean;
};

export function DownloadOptions(props: DownloadOptionsProps) {
  // todo: make env var
  const baseUrl = "https://doc-api.bibleineverylanguage.org";
  const [isLoading, setIsLoading] = createSignal(false);
  const [abortPoll, setAbortPoll] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [docErred, setDocErred] = createSignal(false);
  const [controller, setController] = createSignal<AbortController>(
    new AbortController()
  );
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
    props.allContentResourceTypes.map((x) => x.toLowerCase()).includes("tn") &&
    downloadOptions().fileType !== "SOURCE";
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
    // populate the resource_requests
    const allBooksString = new Set(
      props.currentContent.rendered_contents.htmlChapters.map(
        (c) => c.scriptural_rendering_metadata.book_slug
      )
    );
    // filter represents toggle btw all and current
    let allBooksPayload = [...allBooksString]
      .filter((bookString) =>
        optionsSelected.includeAllBooks
          ? true
          : bookString ===
            props.activeRow()?.scriptural_rendering_metadata.book_slug
      )
      .map((bookSlug) => {
        return {
          lang_code: props.languageCode.toLowerCase(),
          resource_type: props.currentContent.resource_type.toLowerCase(),
          book_code: bookSlug.toLowerCase(),
        };
      });
    basePayload.resource_requests = [...allBooksPayload];

    // map in a tn for each request if needed
    if (optionsSelected.includeTranslationsNotes && canShowTn()) {
      const allTnResourceRequests = basePayload.resource_requests.map((req) => {
        return {
          ...req,
          resource_type: "tn",
        };
      });
      basePayload.resource_requests = [
        ...basePayload.resource_requests,
        ...allTnResourceRequests,
      ];
    }
    return basePayload;
  };

  const startDownload = async () => {
    const optionsSelected = downloadOptions();
    if (optionsSelected.fileType === "SOURCE") {
      const srcForm = document.querySelector(
        "[data-js='proxy-source-zips'"
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

  return (
    <div class="md:(min-w-20)">
      <DropdownMenu
        open={dialogOpen()}
        gutter={0}
        placement={props.langDirection === "ltr" ? "bottom-end" : "top-start"}
        sameWidth={false}
      >
        <DropdownMenu.Trigger
          class="px-2 py-2 aspect-square md:aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest rounded-lg bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest) focus:(bg-brand-base ring-4 ring-brand ring-offset-6)"
          onClick={() => setDialogOpen(!dialogOpen())}
        >
          {/* todo i18n */}
          <span class="i i-ic:baseline-download"></span>
          <span class="hidden md:inline">download</span>
          <span class="i i-mdi:chevron-down hidden md:inline"></span>
        </DropdownMenu.Trigger>
        <DropDownPortal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          updateDownloadOptions={updateDownloadOptions}
          canShowTn={canShowTn}
          startDownload={startDownload}
          currentContent={props.currentContent}
          zipSrc={props.zipSrc}
          doShowAllBooksToggle={doShowAllBooksToggle}
          isLoading={isLoading}
          abort={abort}
          docErred={docErred}
        />
      </DropdownMenu>
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
};
function DropDownPortal(props: DropDownPortalProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        onInteractOutside={() => props.setDialogOpen(false)}
        class="w-min! bg-surface-primary z-10 border border-solid relative p-2 rounded-lg shadow-lg  min-w-70 md:min-w-90  flex flex-col gap-6"
      >
        <div class="flex justify-between">
          <DownloadOptionsTitle />
          <CloseButton onClick={props.setDialogOpen} />
        </div>
        <FileTypePicker updateDownloadOptions={props.updateDownloadOptions} />
        <Show when={props.canShowTn()}>
          <TranslationNotesToggle
            updateDownloadOptions={props.updateDownloadOptions}
          />
        </Show>
        <Show when={props.doShowAllBooksToggle()}>
          <IncludeAllBooksToggle
            updateDownloadOptions={props.updateDownloadOptions}
          />
        </Show>

        <DownloadButton
          startDownload={props.startDownload}
          isLoading={props.isLoading}
          abort={props.abort}
          docErred={props.docErred}
        />
        <OpenInDocButton />
        <a data-js="proxy-sw-doc" class="hidden">
          Doc it
        </a>
        <HiddenZipSrcForm
          currentContent={props.currentContent}
          zipSrc={props.zipSrc}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

function DownloadOptionsTitle() {
  return <h2 class="color-onSurface-primary">Download options</h2>;
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
};
function FileTypePicker(props: FileTypePickerProps) {
  type OptionType = {value: string; label: string};
  const options = (): OptionType[] => {
    return [
      {value: "PDF", label: "PDF"},
      {value: "EPUB", label: "EPUB"},
      {value: "DOCX", label: "DOCX"},
      {value: "SOURCE", label: "Source (zip)"},
    ];
  };
  return (
    <Select
      sameWidth={true}
      gutter={0}
      options={options()}
      onChange={(e) => {
        if (e) {
          props.updateDownloadOptions(
            "fileType",
            e.value as DownloadArgs["fileType"]
          );
        }
      }}
      defaultValue={{value: "PDF", label: "PDF"}}
      optionValue={"value"}
      optionTextValue={"label"}
      placeholder="Select a format"
      itemComponent={(props) => (
        <Select.Item
          item={props.item}
          class="flex items-center justify-between hover:(bg-brand-light cursor-pointer text-brand-base)"
        >
          <Select.ItemLabel class="w-full data-[selected]:(bg-brand-base text-onSurface-invert) p-1">
            {props.item.rawValue.label}
          </Select.ItemLabel>
        </Select.Item>
      )}
      class="flex justify-between w-full items-center gap-2"
    >
      <Select.Label class="inline-block shrink-0">File Type</Select.Label>
      <Select.Trigger
        class="bg-surface-secondary border border-solid border-surface-border px-2 py-1 rounded-xl relative inline-flex justify-between items-center w-full"
        aria-label="Fruit"
      >
        <Select.Value<OptionType> class="select__value">
          {(state) => state.selectedOption().label}
        </Select.Value>
        <Select.Icon class="select__icon">
          <span class="i i-material-symbols:arrow-forward h-6 w-6 " />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="bg-surface-primary z-10 shadow-sm bg-surface-secondary rounded-md overflow-hidden">
          <Select.Listbox class="" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

type ToggleButtonProps = {
  updateDownloadOptions: (
    key: keyof DownloadArgs,
    value: boolean | "PDF" | "EPUB" | "DOCX" | "SOURCE"
  ) => void;
};
function TranslationNotesToggle(props: ToggleButtonProps) {
  return (
    <div class="flex items-center justify-between">
      <p>Inclue Translation Notes</p>
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
      <p>Include All books</p>
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
}) {
  return (
    <div class="w-full flex flex-col gap-4 ">
      <Show when={props.isLoading() && !props.docErred()}>
        <IndeterminateProgress />
        <p class="w-full flex gap-2 items-center text-sm justify-between">
          <span>Generating your file, please wait</span>
          <button class="text-brand-base underline" onClick={props.abort}>
            Cancel
          </button>
        </p>
      </Show>
      <Show when={props.docErred()}>
        <p class="w-full">
          Something went wrong. Your file couldn't be generated. You may try
          again or contact us
        </p>
      </Show>
      <Show when={!props.isLoading()}>
        <button
          onClick={props.startDownload}
          class="px-2 py-1 aspect-square md:aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest rounded-lg bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest) focus:(bg-brand-base ring-4 ring-brand ring-offset-6) justify-center items-center"
        >
          <span class={` i-mdi:download h-4 w-4`} />
          Download
        </button>
      </Show>
    </div>
  );
}
function OpenInDocButton() {
  return (
    <a
      href="https://doc.bibleineverylanguage.org"
      data-js="open-in-doc-btn"
      class="text-brand-base inline-flex gap-1 items-center justify-center underline w-max mx-auto"
      target="_blank"
    >
      <span class="i-octicon:link-external-24 w-1em h-1em" />
      open in doc
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
      <button>Proxy zip SW</button>
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
