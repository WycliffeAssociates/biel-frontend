import type { TsDirectoryFile } from "@customTypes/types";
import { Dialog } from "@kobalte/core/dialog";
import type { i18nDictType } from "@src/i18n/strings";
import { type Accessor, type Setter, Show, lazy } from "solid-js";

const PdfPreviewer = lazy(() => import("./TsPdfFilePreviewer"));

export type PreviewerProps = {
	currentPreviewing: Accessor<null | TsDirectoryFile>;
	setTsFilePreviewing: Setter<TsDirectoryFile | null>;
	i18nDict: i18nDictType;
};

export function FilePreviewer(props: PreviewerProps) {
	// const [pdfData, setPdfData] = createSignal<Uint8Array | null>(null);
	return (
		<Show
			when={props.currentPreviewing()?.fileType === "pdf"}
			fallback={<WordFilesPreviewer {...props} />}
		>
			<PdfPreviewer {...props} />
		</Show>
	);
}

function WordFilesPreviewer(props: PreviewerProps) {
	const isPowerPoint = (type: string) => {
		return ["ppt", "pptx"].includes(type);
	};
	return (
		<Dialog open={true}>
			<Dialog.Portal>
				<Dialog.Overlay class="bg-black/70 z-20 absolute inset-0" />
				<div class="absolute inset-6   z-20 rounded-xl shadow-lg  bg-surface-primary max-w-5xl mx-auto p-2">
					<Dialog.Content
						// data-js="tsContentRef"
						class="px-4 pb-4 h-[min(90vh,_100%)] overflow-y-auto grid-rows-[auto_1fr] theText"
						onInteractOutside={() => props.setTsFilePreviewing(null)}
						onEscapeKeyDown={() => props.setTsFilePreviewing(null)}
					>
						<div class="relative sticky top-0 bg-surface-primary pbs-4 flex gap-2 items-center justify-between">
							<div class="flex  items-center">
								<Dialog.Title class="font-step--1! md:font-step-1! font-700 m-0!">
									{props.currentPreviewing()?.fileName}
								</Dialog.Title>
							</div>
							<div class="flex gap:2 md:gap-6">
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
						<iframe
							class={`w-full max-h-80% md:(py-4 px-8) ${
								isPowerPoint(props.currentPreviewing()?.fileType!)
									? "aspect-16/9"
									: "aspect-[1/1.254]"
							}`}
							src={`https://view.officeapps.live.com/op/embed.aspx?src=${
								props.currentPreviewing()?.url
							}`}
							title="file preview"
						/>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog>
	);
}

export function DownloadSingleFileForm(props: {
	currentPreviewing: TsDirectoryFile;
}) {
	// https://github.com/WycliffeAssociates/TS-biel-files/raw/master/training/English%20(en)/COBT%20Training%20Modules%20[COBT-T]%20/00.%20Intro%20to%20Wycliffe%20Associates/00%20WA%20Intro%20-%20WT%20Slides.pdf
	// https://github.com/WycliffeAssociates/TS-biel-files/raw/refs/heads/master/training/English%20(en)/Refinement%20and%20Publication%20Training%20%5BR&P%5D/Key%20Words/Key%20Words%20WT%20Slides.pdf

	console.log(props.currentPreviewing.url);
	return (
		<a
			class="bg-brand-light aspect-square w-8 rounded-xl group hover:(bg-brand-base text-onSurface-invert) focus:(ring-4 ring-offset-6) inline-flex items-center justify-center"
			href={encodeURI(props.currentPreviewing.url)}
		>
			<span class="i i-ic:baseline-download bg-brand-base p-2 group-hover:(bg-onSurface-invert)" />
		</a>
	);
}

export default FilePreviewer;
