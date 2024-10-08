import {Dialog} from "@kobalte/core/dialog";
import {
  DownloadButton,
  FileTypePicker,
  HiddenZipSrcForm,
  IncludeAllBooksToggle,
  OpenInDocButton,
  TranslationNotesToggle,
  type DropDownPortalProps,
} from "./DownloadOptions";
import {Show} from "solid-js";

export default function DownloadModal(
  props: DropDownPortalProps & {
    langDirection: "ltr" | "rtl";
    ietfCode: string;
  }
) {
  return (
    <Dialog>
      <Dialog.Trigger
        class="px-2 py-2 aspect-square bg-brand-light text-brand-base rounded-lg focus:(bg-brand-base ring-4 ring-brand ring-offset-6) md:(aspect-auto bg-brand border-x-2 border-t-2 border-b-4 border-brand-darkest  bg-brand-base text-onSurface-invert! flex gap-2 items-center hover:(bg-brand-darkest) active:(bg-brand-darkest))"
        onClick={() => props.setDialogOpen(!props.dialogOpen())}
      >
        <span class="i i-ic:baseline-download w-7 h-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content class="fixed inset-0 z-20 bg-surface-primary p-2 flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <Dialog.CloseButton
              class={`${
                props.langDirection === "ltr"
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
          {/* biome-ignore lint/a11y/useValidAnchor: <href anchor is filled in via js before clicking based on > */}
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
