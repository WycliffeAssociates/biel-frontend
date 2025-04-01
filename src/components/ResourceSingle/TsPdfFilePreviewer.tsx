import {Dialog} from "@kobalte/core/dialog";
import {createVisibilityObserver} from "@solid-primitives/intersection-observer";
import type {i18nDictType} from "@src/i18n/strings";
import {formatBytes} from "@src/utils";
import * as pdfjsLib from "pdfjs-dist";
import type {PDFDocumentProxy} from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?worker";
import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import {Dynamic} from "solid-js/web";
import {DownloadSingleFileForm, type PreviewerProps} from "./TsFilePreviewer";

const worker = new pdfjsWorker();
pdfjsLib.GlobalWorkerOptions.workerPort = worker;

type Pdf = PDFDocumentProxy | null;
type PageInfo = {
  index: number;
  loaded: boolean;
  height: number;
  width: number;
};
type PDFMeta = {
  numPages: number;
  modDate: string | null;
  size: string;
};

function PdfPreviewer(props: PreviewerProps) {
  // biome-ignore lint/style/useConst: <explanation>
  let containerRef: HTMLDivElement | undefined = undefined;
  const [loading, setLoading] = createSignal(true);
  const [pdf, setPdf] = createSignal<Pdf>(null);
  const [pageInfos, setPageInfos] = createSignal<PageInfo[]>([]);
  const [loadingErr, setLoadingErr] = createSignal(false);
  const [pdfMeta, setPdfMeta] = createSignal<PDFMeta | null>(null);

  async function fetchPdf() {
    if (!props.currentPreviewing()) return;

    try {
      const url = encodeURIComponent(props.currentPreviewing()!.url);
      const res = await fetch(
        `/api/fetchExternal?url=${url}&hash=${props.currentPreviewing()!.sha}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch PDF: ${res.statusText}`);
      }

      const buffer = await res.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument(buffer).promise;
      setPdf(pdfDoc);

      // Initialize page info with dimensions (get first page to determine default size)
      const firstPage = await pdfDoc.getPage(1);
      const viewport = firstPage.getViewport({scale: 1});

      // Create page info objects for all pages
      const pages: PageInfo[] = Array.from(
        {length: pdfDoc.numPages},
        (_, i) => ({
          index: i + 1,
          loaded: false,
          height: viewport.height,
          width: viewport.width,
        })
      );

      const meta = await pdfDoc.getMetadata();
      // debugger;
      setPageInfos(pages);
      setPdfMeta({
        numPages: pages.length,
        // @ts-ignore
        modDate: formatPdfDate(meta.info?.ModDate),
        size: formatBytes(props.currentPreviewing()!.size),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setLoadingErr(true);
      setLoading(false);
    }
  }

  onMount(() => {
    fetchPdf();
    return () => {
      setLoading(true);
      setPageInfos([]);
      setPdf(null);
      setLoadingErr(false);
    };
  });

  return (
    <Dialog open={true}>
      <Dialog.Portal>
        <Dialog.Overlay class="bg-black/70 z-20 absolute inset-0" />
        <div class="absolute inset-6 z-20 rounded-xl shadow-lg bg-surface-primary max-w-5xl mx-auto p-2">
          <Dialog.Content
            class="px-4 pb-4 overflow-y-auto h-[min(90vh,_100%)] grid-rows-[auto_1fr] theText"
            onInteractOutside={() => props.setTsFilePreviewing(null)}
            onEscapeKeyDown={() => props.setTsFilePreviewing(null)}
          >
            <div class="relative sticky top-0 bg-surface-primary pbs-4 flex items-center justify-between">
              <div class="flex gap-4 items-center">
                <div class="flex flex-col">
                  <Dialog.Title class="font-step-1! font-700 m-0!">
                    {props.currentPreviewing()?.fileName}
                  </Dialog.Title>
                  <Show when={pdfMeta() && props.i18nDict.filePreviewerPdfMeta}>
                    <p class="m-0!">
                      {replacePlaceholders(
                        props.i18nDict.filePreviewerPdfMeta,
                        {
                          size: pdfMeta()!.size,
                          numPages: pdfMeta()!.numPages,
                          modDate: pdfMeta()!.modDate || "",
                        }
                      )}
                    </p>
                  </Show>
                </div>
              </div>
              <div class="flex gap-6">
                <DownloadSingleFileForm
                  currentPreviewing={props.currentPreviewing()!}
                />
                <Dialog.CloseButton
                  class="p-1 rounded-lg bg-surface-secondary!"
                  onClick={() => props.setTsFilePreviewing(null)}
                >
                  <span class="i-ic:round-close w-1.25em h-1.25em inline-block bg-onSurface-secondary" />
                </Dialog.CloseButton>
              </div>
            </div>

            <Show when={loading()}>
              <div class="flex justify-center items-center py-8">
                <div class="text-center flex-col flex items-center">
                  <div class="mb-2">
                    {props.i18nDict.filePreviwerLoadingPdf}
                  </div>
                  <Spinner />
                </div>
              </div>
            </Show>

            <Show
              when={!loadingErr()}
              fallback={<div>{props.i18nDict.filePreviwerLoadingPdfError}</div>}
            >
              <div class="overflow-y-auto pbs-6" ref={containerRef}>
                <For each={pageInfos()}>
                  {(pageInfo) => (
                    <Dynamic
                      component={PdfPage}
                      pdf={pdf()}
                      pageInfo={pageInfo}
                      i18nDict={props.i18nDict}
                    />
                  )}
                </For>
              </div>
            </Show>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}

function PdfPage(props: {
  pdf: Pdf;
  pageInfo: PageInfo;
  i18nDict: i18nDictType;
}) {
  const [rendered, setRendered] = createSignal(false);
  const [pageLoadErr, setPageLoadErr] = createSignal(false);
  let canvasRef: HTMLCanvasElement | undefined;

  const useVisibilityObserver = createVisibilityObserver({threshold: 0.1});
  const isVisible = useVisibilityObserver(() => canvasRef);

  const renderPage = async () => {
    if (!props.pdf || rendered() || !canvasRef) return;

    try {
      const page = await props.pdf.getPage(props.pageInfo.index);
      const viewport = page.getViewport({scale: 1});
      const context = canvasRef.getContext("2d");

      if (!context) return;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      setRendered(true);
    } catch (error) {
      console.error(`Failed to render page ${props.pageInfo.index}:`, error);
      setPageLoadErr(true);
    }
  };

  // Watch visibility changes and render when visible
  createEffect(() => {
    if (isVisible() && !rendered()) {
      renderPage();
    }
    onCleanup(() => {
      // setRendered(false);
      setPageLoadErr(false);
    });
  });
  return (
    <div class="pdf-page-container mb-4 p-1">
      <div class="page-number text-center text-sm text-gray-500 mb-1">
        {props.i18nDict.page} {props.pageInfo.index}
      </div>
      <Show
        when={!pageLoadErr()}
        fallback={
          <div>{props.i18nDict.filePreviewerInvidualPageLoadError}</div>
        }
      >
        <canvas
          ref={canvasRef}
          width={props.pageInfo.width}
          height={props.pageInfo.height}
          class="mx-auto border border-gray-300 max-w-full max-h-full"
        />
      </Show>
    </div>
  );
}

function parsePdfDate(pdfDate: string) {
  const match = pdfDate.match(
    /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z?/
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second] = match.map(Number);
  if ([year, month, day, hour, minute, second].some(Number.isNaN)) return null;
  return new Date(Date.UTC(year!, month! - 1, day, hour, minute, second)); // Month is 0-based
}
function formatPdfDate(dateString: string) {
  const date = parsePdfDate(dateString);
  if (!date) return null;
  return date.toLocaleDateString(window.navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function replacePlaceholders(
  template: string,
  namedArguments: Record<string, string | number>
): string {
  // Example usage:
  // const template = "Size: {{size}}, Pages: {{numPages}}, Last Updated: {{modDate}}";
  // const values = { size: "10MB", numPages: 5, modDate: "2024-03-13" };

  // console.log(replacePlaceholders(template, values));
  // // Output: "
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in namedArguments ? String(namedArguments[key]) : `{{${key}}}`
  );
}

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      class="animate-spin"
    >
      <title> Loading Indicator </title>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
    </svg>
  );
}

export default PdfPreviewer;
