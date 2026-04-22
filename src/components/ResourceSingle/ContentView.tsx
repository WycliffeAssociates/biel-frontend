import type {
	ScriptureStoreState,
	TsDirectoryFile,
	TsDirectoryLang,
} from "@customTypes/types";
import { Checkbox } from "@kobalte/core/checkbox";
import { CustomXCacheTagHeader, previewableFileTypes } from "@lib/constants";
import slugify from "@sindresorhus/slugify";
import {
	createSignal,
	For,
	lazy,
	onCleanup,
	onMount,
	Show,
	Suspense,
} from "solid-js";
import { ScripturalView } from "./ContentScriptural";
import { PeripheralMenu } from "./Menu";
import { useResourceSingleContext } from "./ResourceSingleContext";

const LazyFilePreviewer = lazy(() => import("./TsFilePreviewer"));

type ContentViewProps = {
	classes?: string;
};
export function ContentView(props: ContentViewProps) {
	const {
		fitsScripturalSchema,
		activeContent,
		viewType,
		selectedTsFolder,
		tsFilePreviewing,
		setTsFilePreviewing,
		i18nDict,
	} = useResourceSingleContext();
	return (
		<Suspense>
			<Show when={viewType() === "readable"}>
				<div
					data-name="contentView"
					data-js="contentView"
					class={`${props.classes || ""}`}
				>
					<Show when={fitsScripturalSchema()}>
						<ScripturalView />
					</Show>
					<Show when={!fitsScripturalSchema()}>
						<PeripheralView content={activeContent} />
					</Show>
				</div>
			</Show>
			<Show when={viewType() === "downloadable"}>
				{/* <p>{tsFolders()}</p> */}
				<div
					data-name="contentViewDownloadable"
					data-js="contentView"
					data-testid="contentViewDownloadable"
					class={`${props.classes || ""} pbe-16! pie-4px!  max-h-70vh! overflow-y-auto!`}
				>
					<DownloadableView tsTree={selectedTsFolder()} loopIter={0} />
				</div>
			</Show>
			<Show when={tsFilePreviewing()}>
				<LazyFilePreviewer
					currentPreviewing={tsFilePreviewing}
					setTsFilePreviewing={setTsFilePreviewing}
					i18nDict={i18nDict}
				/>
			</Show>
		</Suspense>
	);
}

function DownloadableView(props: {
	tsTree:
		| {
				folderName: string;
				subTree: TsDirectoryLang;
		  }
		| undefined;
	loopIter?: number;
}) {
	const {
		tsFilesForDownload,
		setTsFilesForDownload,
		downloadableSearchTerm,
		i18nDict,
		setTsFilePreviewing,
	} = useResourceSingleContext();
	if (!props.tsTree) {
		return null;
	}
	// const [wholeFolderChecked, setWholeFolderChecked] = createSignal(false);
	const wholeChecked = () => {
		return props.tsTree?.subTree.files.every((file) =>
			tsFilesForDownload().has(file.path),
		);
	};

	const isChecked = (file: TsDirectoryFile) => {
		return tsFilesForDownload().has(file.path);
	};

	const toggle = (file: TsDirectoryFile) => {
		if (isChecked(file)) {
			setTsFilesForDownload((prev) => {
				prev.delete(file.path);
				return new Map(prev);
			});
		} else {
			setTsFilesForDownload((prev) => {
				prev.set(file.path, file);
				return new Map(prev);
			});
		}
	};
	const selectSubTree = (wholeChecked: boolean, files: TsDirectoryFile[]) => {
		setTsFilesForDownload((prev) => {
			files.forEach((file) => {
				wholeChecked ? prev.delete(file.path) : prev.set(file.path, file);
			});
			// setWholeFolderChecked(!wholeFolderChecked());
			return new Map(prev);
		});
	};

	const filterFilesAgainstSearch = (files: TsDirectoryFile[]) => {
		const searchTerm = downloadableSearchTerm().toLowerCase();
		if (!searchTerm) return files;
		return files.filter((file) => {
			return file.fileName.toLowerCase().includes(searchTerm);
		});
	};

	const lang =
		typeof window !== "undefined" ? window?.navigator?.language || "en" : "en";
	const dateFormatter = new Intl.DateTimeFormat(lang, {
		year: "numeric",
		month: "2-digit",
	});

	const spaceInline = props.loopIter ? props.loopIter * 20 : 0;
	onMount(() => {
		const windowHash = window.location.hash;
		if (windowHash) {
			const el = document.querySelector(windowHash);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", inline: "start" });
			}
		}
	});
	return (
		<div>
			<Show when={props.loopIter && props.loopIter > 0}>
				<h2
					style={{
						"padding-inline-start": `${spaceInline}px`,
						"z-index": `${props.loopIter ? props.loopIter : 1}`,
					}}
					class="font-600 text-xl sticky top-0 bg-surface-primary  pb-2 text-onSurface-primary"
				>
					<Show
						when={filterFilesAgainstSearch(props.tsTree.subTree.files).length}
					>
						<Checkbox
							checked={wholeChecked()}
							onChange={() =>
								selectSubTree(
									wholeChecked() || false,
									filterFilesAgainstSearch(props.tsTree!.subTree.files),
								)
							}
							class="flex items-center gap-2 mbs-6"
						>
							<Checkbox.Input />
							<Checkbox.Control class="h-4 w-4 rounded-2px border relative border-brand-base data-[checked]:(bg-brand-base text-onSurface-invert border-none)">
								<Checkbox.Indicator class="">
									<span class="i-material-symbols:check w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
								</Checkbox.Indicator>
							</Checkbox.Control>
							<Checkbox.Label
								class="data-[checked]:(text-brand-base) transition-colors transition-duration-25 "
								id={slugify(props.tsTree.folderName)}
								// data-id={encodeURIComponent(props.tsTree.folderName)}
							>
								{" "}
								{props.tsTree.folderName}
							</Checkbox.Label>
						</Checkbox>
					</Show>
					<Show
						when={!filterFilesAgainstSearch(props.tsTree.subTree.files).length}
					>
						{props.tsTree.folderName}
					</Show>
				</h2>
			</Show>
			<Show when={filterFilesAgainstSearch(props.tsTree.subTree.files).length}>
				<ul
					data-testid="contentViewDownloadableFilesList"
					style={{
						"padding-inline-start": `${spaceInline}px`,
						"z-index": `${props.loopIter ? props.loopIter : 1}`,
					}}
					class="flex flex-col gap-2 text-onSurface-secondary"
				>
					<For each={filterFilesAgainstSearch(props.tsTree.subTree.files)}>
						{(file) => (
							<li
								class={`relative pis-0px ${
									props.loopIter && props.loopIter > 0
										? "font-500 last:mbe-4"
										: ""
								}
                `}
								style={{
									"--inlineStart": `-${spaceInline}px`,
									"--fileWidth": `${spaceInline - 2}px`,
								}}
							>
								<Checkbox
									checked={isChecked(file)}
									onChange={() => toggle(file)}
									class="flex items-center gap-4 cursor-pointer rounded-xl p-2 hover:(bg-surface-secondary)"
								>
									<Checkbox.Input />
									<Checkbox.Control class="h-4 w-4 rounded-2px border relative border-brand-base data-[checked]:(bg-brand-base text-onSurface-invert border-none)">
										<Checkbox.Indicator class="">
											<span class="i-material-symbols:check w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
										</Checkbox.Indicator>
									</Checkbox.Control>
									<Checkbox.Label class="data-[checked]:(text-brand-base) inline-flex gap-2 items-center justify-between w-full pe-2 group">
										<span class="justify-between md:justify-start flex gap-3 items-center">
											<span class="font-step--1 md:font-step-0">
												{file.fileName}
											</span>
											<Show when={previewableFileTypes.includes(file.fileType)}>
												<button
													onClick={() => {
														setTsFilePreviewing(file);
													}}
													type="button"
													class="i-mdi:eye hover:bg-brand-base! focus:bg-brand-base! w-1.35em h-1.35em"
												/>
											</Show>
										</span>
										<Show when={file.lastUpdated}>
											<small class="hidden md:block font-step--2 text-onSurface-tertiary inlinex-flex gap-2px group-data-[checked]:(text-brand-base)">
												<span>{i18nDict.updated}</span>
												<span>
													{" "}
													({dateFormatter.format(new Date(file.lastUpdated!))})
												</span>
											</small>
										</Show>
									</Checkbox.Label>
								</Checkbox>
							</li>
						)}
					</For>
				</ul>
			</Show>
			<Show when={Object.keys(props.tsTree.subTree.folders).length}>
				<ul class="">
					<For each={Object.entries(props.tsTree.subTree.folders)}>
						{([folderName, folder]) => {
							return (
								<DownloadableView
									loopIter={props.loopIter ? props.loopIter + 1 : 1}
									tsTree={{
										folderName,
										subTree: folder,
									}}
								/>
							);
						}}
					</For>
				</ul>
			</Show>
		</div>
	);
}

// NOTE: THIS IS ONLY TW RIGHT NOW.  SPLIT INTO A TW SPECIFIC IF OTHER NON SCRIPTURAL SCHEMA STUFF IS SUPPORTED
function PeripheralView(props: { content: ScriptureStoreState }) {
	//
	const {
		isBig,
		i18nDict,
		twState,
		setTwState,
		activeContent,
		doBustCache,
		langCode,
	} = useResourceSingleContext();
	const [fetchProgress, setFetchProgress] = createSignal(0);
	const [doShowProgress, setDoShowProgress] = createSignal(false);

	const printAllFile = props.content.rendered_contents.otherFiles.find((f) =>
		f.url.includes("print_all.html"),
	);

	onMount(async () => {
		if (!twState()?.html && printAllFile) {
			setTimeout(() => setDoShowProgress(true), 100);
			let url = `${globalThis.origin}/api/fetchExternal?url=${encodeURI(
				printAllFile.url,
			)}&hash=${printAllFile.hash}&resource-type=TW&rewrite=true`;
			if (doBustCache) {
				url += "&no-cache=1";
			}
			const res = await fetch(url, {
				headers: {
					[CustomXCacheTagHeader]: `${slugify(props.content.name)},${slugify(langCode)}`,
				},
			});
			const reader = res.body?.getReader();
			if (!reader) {
				throw new Error("no reader");
			}
			let received = 0;
			const chunks = [];
			let bodyNotFinsished = true;
			while (bodyNotFinsished) {
				const { done, value } = await reader.read();
				if (done) {
					bodyNotFinsished = false;
				}
				if (value) {
					chunks.push(value);
					received += value.length;
					setFetchProgress(
						Math.min(
							100,
							Math.round((received / printAllFile.file_size_bytes) * 100),
						),
					);
				}
			}
			const allChunks = new Uint8Array(received);
			let offset = 0;
			for (const chunk of chunks) {
				allChunks.set(chunk, offset);
				offset += chunk.length;
			}
			const allChunksString = new TextDecoder().decode(allChunks);
			const sectionsRegex = /<div\s+id="[^"]+"[\s\S]*?<hr\/>/gi;
			const sections = allChunksString.match(sectionsRegex);
			if (!sections) {
				throw new Error("no sections found");
			}
			const withMeta = sections
				?.map((section) => {
					const fragment = new DOMParser().parseFromString(
						section,
						"text/html",
					);
					const idHeader = fragment.querySelector("h2[id]");
					const id = idHeader?.id || "";
					const innerText = idHeader?.textContent?.replaceAll('"', "") || null;
					const oneWordSlug =
						idHeader?.textContent?.split(",")[0]?.replaceAll('"', "") ||
						innerText ||
						id ||
						"";
					return { id, innerHtml: section, oneWordSlug };
				})
				.sort((a, b) => {
					return a.oneWordSlug.localeCompare(b.oneWordSlug);
				});
			const sortedHtml = withMeta.reduce((acc, cur) => {
				return acc + cur.innerHtml;
			}, "");

			// Check for hash in URL to auto-select TW word
			const windowHash = window.location.hash.slice(1); // Remove #
			let initialWord = withMeta[0]; // Default to first word
			if (windowHash) {
				const hashMatch = withMeta.find((w) => w.id === windowHash);
				if (hashMatch) {
					initialWord = hashMatch;
				}
			}

			// Ensure we have a valid word (fallback to first if somehow undefined)
			const selectedWord = initialWord || withMeta[0];

			// Extract only the required properties for currentWord
			const currentWordData = selectedWord
				? {
						id: selectedWord.id,
						oneWordSlug: selectedWord.oneWordSlug,
					}
				: null;

			setTwState({
				menuList: withMeta.map((w) => ({
					id: w.id,
					oneWordSlug: w.oneWordSlug,
				})),
				html: sortedHtml,
				currentWord: currentWordData,
			});

			// Scroll to the selected word after state is set
			setTimeout(() => {
				if (selectedWord) {
					const targetElement = document.querySelector(`#${selectedWord.id}`);
					if (targetElement) {
						targetElement.scrollIntoView({
							behavior: "smooth",
							inline: "start",
						});
					}
				}
			}, 100);
		}

		// Add hashchange event listener to handle manual URL hash changes
		const handleHashChange = () => {
			const currentTwState = twState();
			if (!currentTwState?.menuList) return;

			const windowHash = window.location.hash.slice(1); // Remove #
			if (windowHash) {
				const hashMatch = currentTwState.menuList.find(
					(w) => w.id === windowHash,
				);
				if (hashMatch) {
					setTwState((prev) => ({
						...prev,
						currentWord: hashMatch,
					}));

					// Scroll to the selected word
					setTimeout(() => {
						const targetElement = document.querySelector(`#${hashMatch.id}`);
						if (targetElement) {
							targetElement.scrollIntoView({
								behavior: "smooth",
								inline: "start",
							});
						}
					}, 100);
				}
			}
		};

		window.addEventListener("hashchange", handleHashChange);

		// Cleanup event listener on component unmount
		onCleanup(() => {
			window.removeEventListener("hashchange", handleHashChange);
		});
	});

	function TwFallback() {
		return (
			<Show when={doShowProgress()}>
				<div class="md:(col-start-2 row-start-2) max-w-prose">
					{i18nDict.ls_LoadingPercent}
					{fetchProgress()}
				</div>
			</Show>
		);
	}
	// onLoad, fetch print_all.html file... Load it into a document fragment. Take the innerhtml of the body
	return (
		// <div class="row-start-1 col-start-2">
		<Show when={twState()?.html} fallback={<TwFallback />}>
			<div class="md:(col-start-2 row-start-2) max-w-prose">
				<Show when={twState()?.html}>
					<div class="theText theTextTw  px-2" innerHTML={twState()!.html!} />
				</Show>
			</div>
			<Show when={!isBig()}>
				<div class="sticky bottom-0">
					<PeripheralMenu
						activeContent={activeContent}
						i18nDict={i18nDict}
						twState={twState}
						setTwState={setTwState}
						isBig={isBig}
					/>
				</div>
			</Show>
		</Show>
	);
}
