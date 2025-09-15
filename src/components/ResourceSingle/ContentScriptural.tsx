import type { ScriptureStoreState } from "@customTypes/types";
import { Accordion } from "@kobalte/core/accordion";
import { Dialog } from "@kobalte/core/dialog";
import { CustomXCacheTagHeader } from "@lib/constants";
import { createMediaQuery } from "@solid-primitives/media";
import type { RenderedContentRow } from "@src/data/gqlQueries/queries";
import type { i18nDictType } from "@src/i18n/strings";
import { nfdLowerNormalize } from "@src/utils";
import {
	createEffect,
	createResource,
	createSignal,
	For,
	Match,
	on,
	onCleanup,
	onMount,
	type Resource,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { DownloadOptions } from "./DownloadOptions";
import {
	changeActiveRow,
	changeActiveRowByUrl,
	fetchHtmlChapters,
	getBoundingRectMenu,
	resourceByBookChap,
	scrollIntoViewIfNeeded,
} from "./lib";
import { useResourceSingleContext } from "./ResourceSingleContext";

// type ContentType = domainScripture & ScriptureStoreState;
type ContentType = ScriptureStoreState;

export function ScripturalView() {
	const {
		isBig,
		i18nDict,
		activeContent: content,
		setActiveContent,
		doBustCache,
		langCode,
	} = useResourceSingleContext();

	const [text, { refetch }] = createResource(
		// when this source signal changes, i.e. the combo of content name changes, and or the active row changes
		() => ({
			name: content.name,
			langCode: langCode,
			selected: content.rendered_contents.htmlChapters[content.activeRowIdx],
			doBustCache,
		}),
		fetchHtmlChapters,
		{
			ssrLoadFrom: "initial",
		},
	);
	const [modalOpen, setModalOpen] = createSignal(false);
	type ModalContent =
		| {
				title: string;
				body: string;
		  }
		| undefined;
	const [modalContent, setModalContent] = createSignal<ModalContent>();
	const [modalContentStack, setModalContentStack] = createSignal<
		ModalContent[]
	>([]);
	let modalContentRef: HTMLElement | undefined;
	onMount(() => {
		// Deferring fething the initial html for resource so it gets cached in SW and in Cloudlare by its url, by also speeds up perception of things happening since we see the shell and in case this call to resource takes a second
		refetch();
	});

	function handleInternalTnLinks(e: MouseEvent) {
		e.preventDefault();
		const link = e.target as HTMLAnchorElement;
		const chapter = link.getAttribute("data-chapter");
		const book = link.getAttribute("data-book");
		const hash = link.getAttribute("data-hash");
		const activeRow = content.rendered_contents.htmlChapters.findIndex(
			(row) =>
				Number(row.scriptural_rendering_metadata?.chapter) ===
					Number(chapter) &&
				row.scriptural_rendering_metadata?.book_slug.toLowerCase() ===
					book?.toLowerCase(),
		);
		// setActiveContent
		if (activeRow === content.activeRowIdx) {
			const domElToScrollTo = document.querySelector(`#${hash}`);
			domElToScrollTo?.scrollIntoView({ behavior: "smooth", inline: "start" });
		} else if (activeRow > -1) {
			setActiveContent((prev) => {
				const newState = {
					...prev,
					activeRowIdx: activeRow,
				};
				return newState;
			});
			// update the current url with a replaceState
			if (hash) {
				const url = `${window.location.origin}${
					window.location.pathname
				}?resource-type=${encodeURIComponent(
					content.resource_type,
				)}&book=${book}&chapter=${chapter}#${hash}`;
				window.history.replaceState({}, "", url);
				let totalTime = 0;
				const intervalId = setInterval(() => {
					const domElToScrollTo = document.querySelector(`#${hash}`);
					if (!domElToScrollTo) {
						console.log("no el yet");
						totalTime += 25;
					} else {
						console.log("el so clearing");
						domElToScrollTo?.scrollIntoView({
							behavior: "smooth",
							inline: "start",
						});
						clearInterval(intervalId);
					}
					if (totalTime > 2000) {
						clearInterval(intervalId);
					}
				}, 25);
			}
		}
	}
	function popModalStack() {
		const existingStack = structuredClone(modalContentStack());
		const history = existingStack.pop();
		if (history) {
			setModalContentStack(existingStack);
			modalContentRef?.scroll({
				top: 0,
			});
			setModalContent(history);
			scanForBcLinks();
		}
	}
	const modalStackHasHistory = () => {
		console.log("checking hiostyr");
		return modalContentStack().length >= 1;
	};

	async function fetchModalContent(url: string) {
		try {
			const response = await fetch(url, {
				headers: {
					[CustomXCacheTagHeader]: `${nfdLowerNormalize(content.name)}`,
				},
			});
			const data = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, "text/html");
			const h1 = doc.querySelector("h1");
			const body = doc.querySelector("body");
			if (h1 && body) {
				const contentLeaving = modalContent();
				if (contentLeaving) {
					const existingStack = structuredClone(modalContentStack());
					existingStack.push(contentLeaving);
					setModalContentStack(existingStack);
				}
				modalContentRef?.scroll({
					top: 0,
				});
				setModalContent({
					title: h1.innerHTML,
					body: body.innerHTML,
				});
				setModalOpen(true);
				scanForBcLinks();
			}
		} catch (e) {
			console.error(e);
		}
	}

	function bcLinkEventListner(event: MouseEvent) {
		event.preventDefault();
		const target = event.target as HTMLAnchorElement;
		const datasetMatchingRecord = target.dataset.matchingRecord;
		if (datasetMatchingRecord) {
			const parsed = JSON.parse(datasetMatchingRecord) as {
				url: string;
				hash: string;
			};
			fetchModalContent(
				`${globalThis.origin}/api/fetchExternal?url=${encodeURI(
					parsed.url,
				)}&hash=${parsed.hash}&rewrite=true`,
			);
		}
	}
	function scanForBcLinks() {
		const bibleCommentaryPopups: Array<HTMLAnchorElement> = Array.from(
			document.querySelectorAll("a[href*='popup://']"),
		);
		bibleCommentaryPopups.forEach((link) => {
			const split = link.href.split("//");
			const name = split[1];
			if (!name) return;
			const matchingRecord = content.rendered_contents.otherFiles.find(
				(row) => {
					return row.url.includes(name);
				},
			);

			if (!matchingRecord) return;
			link.dataset.matchingRecord = JSON.stringify(matchingRecord);
			// always remove first to avoid dups
			link.removeEventListener("click", bcLinkEventListner);
			link.addEventListener("click", bcLinkEventListner);
			// link.href = matchingRecord.url;
			// link.target = "_blank";
		});
	}
	createEffect(
		on(text, () => {
			const internalTnLinks: Array<HTMLAnchorElement> = Array.from(
				document.querySelectorAll("[data-internalTn]"),
			);
			for (const link of internalTnLinks) {
				// These have a data-chapter, and data-book.  Change the state to that on click;
				link.addEventListener("click", handleInternalTnLinks);
			}
			scanForBcLinks();

			onCleanup(() => {
				for (const link of internalTnLinks) {
					link.removeEventListener("click", handleInternalTnLinks);
				}
			});
		}),
	);

	return (
		<div
			data-name="contentView"
			data-js="contentView"
			class="flex flex-col gap-4"
		>
			<TextOfResource text={text} dict={i18nDict} />

			{/* wk: Yes, this is in the wrong "place" by name. Thomas chnaged the designs around on me while trying to get it out the door, so for now it's just in a weird spot w/ respect to names. September 26, 2024 */}
			<Show when={!isBig()}>
				<div class="sticky bottom-4 shadow-surface-primary shadow-[0px_20px_0px_0px]">
					<MenuRow classes="self-start" />
					{/* hides text scrolling undernath  */}
					<div class="bg-surface-primary absolute bottom-0 w-full h-full z--1" />
				</div>
			</Show>
			<Show when={modalOpen()}>
				<Dialog
					open={modalOpen()}
					onOpenChange={(isOpen) => {
						if (!isOpen) {
							setModalContentStack([]);
							setModalContent(undefined);
						}
					}}
				>
					<Dialog.Portal>
						<Dialog.Overlay class="bg-black/70 z-20 absolute inset-0" />
						<div class="absolute inset-6  z-20 rounded-xl shadow-lg  bg-surface-primary max-w-prose mx-auto p-2">
							<Dialog.Content
								ref={modalContentRef}
								data-js="modalContentRef"
								class="px-4 pb-4 overflow-y-auto max-h-90vh theText"
								onInteractOutside={() => setModalOpen(false)}
								onEscapeKeyDown={() => setModalOpen(false)}
							>
								<div class="relative sticky top-0 bg-surface-primary pbs-4 flex items-center justify-between">
									<div class="flex gap-4 items-center">
										<Show when={modalStackHasHistory()}>
											<button
												type="button"
												class="p-1 rounded-lg bg-surface-secondary!"
												onClick={() => popModalStack()}
											>
												<span class="i-ic:round-arrow-back rtl:rotate-180 w-1.25em h-1.25em inline-block bg-onSurface-secondary" />
											</button>
										</Show>
										<Dialog.Title
											class="font-step-2! font-700 m-0!"
											innerHTML={modalContent()?.title}
										/>
									</div>
									<Dialog.CloseButton
										class="p-1 rounded-lg bg-surface-secondary!"
										onClick={() => setModalOpen(false)}
									>
										<span class="i-ic:round-close w-1.25em h-1.25em inline-block bg-onSurface-secondary" />
									</Dialog.CloseButton>
								</div>
								<Dialog.Description class="" innerHTML={modalContent()?.body} />
							</Dialog.Content>
						</div>
					</Dialog.Portal>
				</Dialog>
			</Show>
		</div>
	);
}

type MenuRowProps = {
	classes?: string;
};
// menu row could be moved, but is here since this menu is strictly scriptpural, so this exists after the branch of scriptural vs non in logic
export function MenuRow(props: MenuRowProps) {
	const {
		setActiveContent,
		activeContent,
		isBig,
		langDirection,
		i18nDict,
		prefetchAdjacent,
	} = useResourceSingleContext();

	const activeRow = () =>
		activeContent.rendered_contents.htmlChapters[activeContent.activeRowIdx];

	return (
		<div data-name="menuRow" class={`flex gap-4 ${props.classes || ""}`}>
			<Menu
				setActiveContent={setActiveContent}
				langDirection={langDirection}
				content={activeContent}
				activeRow={activeRow}
				i18nDict={i18nDict}
				prefetchAdjacent={prefetchAdjacent}
			/>
			<Show when={isBig()}>
				<DownloadOptions />
			</Show>
		</div>
	);
}

type MenuProps = {
	activeRow: () => RenderedContentRow | undefined;
	content: ContentType;
	langDirection: "ltr" | "rtl";
	setActiveContent: SetStoreFunction<ScriptureStoreState>;
	i18nDict: i18nDictType;
	prefetchAdjacent: (dir: "next" | "prev") => void;
};

function Menu(props: MenuProps) {
	const numHtmlChaps = props.content.rendered_contents.htmlChapters.length;
	return (
		<div
			class="flex flex-grow items-center rtl:flex-row-reverse bg-surface-secondary  px-1 py-2 gap-2 rounded-lg md:(rounded-lg)"
			data-js="menuBoundingRect"
			data-css="menuBoundingRect"
		>
			<NavAdjacentButton
				dir="prev"
				langDirection={props.langDirection}
				htmlChaptersLength={numHtmlChaps}
				activeRowIdx={props.content.activeRowIdx}
				setActiveContent={props.setActiveContent}
				prefetchAdjacent={props.prefetchAdjacent}
			/>
			<MenuDialog
				activeRow={props.activeRow}
				htmlChapters={props.content.rendered_contents.htmlChapters}
				setActiveContent={props.setActiveContent}
				langDirection={props.langDirection}
				i18nDict={props.i18nDict}
			/>
			<NavAdjacentButton
				activeRowIdx={props.content.activeRowIdx}
				dir="next"
				langDirection={props.langDirection}
				htmlChaptersLength={numHtmlChaps}
				setActiveContent={props.setActiveContent}
				prefetchAdjacent={props.prefetchAdjacent}
			/>
		</div>
	);
}

type MenuDialogProps = {
	activeRow: () => RenderedContentRow | undefined;
	htmlChapters: RenderedContentRow[];
	setActiveContent: SetStoreFunction<ScriptureStoreState>;
	langDirection: "ltr" | "rtl";
	i18nDict: i18nDictType;
};
function MenuDialog(props: MenuDialogProps) {
	const [dialogOpen, setDialogOpen] = createSignal(false);
	const [boundingMenuRect, setBoundingMenuRect] = createSignal<DOMRect | null>(
		null,
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
								props.activeRow()?.scriptural_rendering_metadata?.book_name ||
								""
							}"]`,
						);
				}}
			>
				<Dialog.Trigger class="dialog__trigger w-full">
					{props.activeRow()?.scriptural_rendering_metadata?.book_name} {""}
					{props.activeRow()?.scriptural_rendering_metadata?.chapter}
				</Dialog.Trigger>
				<Dialog.Portal>
					<div
						class="absolute"
						style={{
							top: `${isBig() ? `${boundingMenuRect()?.top}px` : "0"}`,
							left: `${isBig() ? `${boundingMenuRect()?.left}px` : "0"}`,
							width: `${isBig() ? `${boundingMenuRect()?.width}px` : "100vw"}`,
						}}
					>
						<Dialog.Content class="absolute top-0 left-0  max-h-screen md:max-h-70vh min-h-200px overflow-auto bg-surface-primary w-full shadow-lg shadow-dark md:rounded-lg">
							<Show when={!isBig()}>
								<div class="sticky top-0 py-4 px-1 bg-surface-primary   flex justify-between items-center z-2">
									<div class="flex gap-4 items-center">
										<button
											type="button"
											class="focus-within:(ring ring-2 ring-offset-2)"
											onClick={() => setDialogOpen(false)}
										>
											<span
												class={`i-material-symbols:arrow-back ${
													props.langDirection === "rtl" &&
													"rotate-180 transform"
												} w-.75em h-.75em font-size-[var(--step-2)]  bg-onSurface-primary!`}
											/>
										</button>
										<Dialog.Title class="">
											{props.i18nDict.ls_Navigate}
										</Dialog.Title>
									</div>
									<DownloadOptions />
								</div>
							</Show>
							<Dialog.Description class="w-full">
								<Accordion
									collapsible
									class="flex flex-col gap-2 px-1 py-1"
									defaultValue={[
										props.activeRow()?.scriptural_rendering_metadata
											?.book_name || "",
									]}
								>
									<For
										each={Object.keys(resourceByBookChap(props.htmlChapters))}
									>
										{(bookName) => (
											<Accordion.Item value={bookName}>
												<div class="flex">
													<Accordion.Trigger class="flex gap-2 bg-surface-secondary w-full justify-between rounded-lg data-[expanded]:(bg-transparent) [&[data-expanded]_span]:rotate-90 px-2 py-3 hover:(bg-surface-secondary)">
														<Accordion.Header
															data-accordionbook={bookName}
															as="h3"
															class="font-step-0 font-500 text-onSurface-secondary"
														>
															{bookName}
														</Accordion.Header>
														<span
															class={
																"i-ic:round-chevron-left w-1.25em h-1.25em text-onSurface-secondary -rotate-90 "
															}
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
																type="button"
																class="w-full text-center flex-grow max-w-13"
																onClick={() => {
																	changeActiveRowByUrl({
																		url: row.url,
																		htmlChapters: props.htmlChapters,
																		setter: props.setActiveContent,
																	});
																	if (globalThis.document) {
																		const theText = document.querySelector(
																			"[data-js='theText']",
																		);
																		const theCol = document.querySelector(
																			"[data-js='rightCol']",
																		);
																		if (theText) {
																			theText.scrollTop = 0;
																		}
																		if (theCol) {
																			theCol.scrollTop = 0;
																		}
																	}
																	setDialogOpen(false);
																}}
															>
																{row.scriptural_rendering_metadata?.chapter}
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

type NavAdjacentButtonProps = {
	dir: "next" | "prev";
	langDirection: "ltr" | "rtl";
	htmlChaptersLength: number;
	activeRowIdx: number;
	setActiveContent: SetStoreFunction<ScriptureStoreState>;
	prefetchAdjacent: (dir: "next" | "prev") => void;
};
function NavAdjacentButton(props: NavAdjacentButtonProps) {
	const isDisabled = () => {
		if (props.langDirection === "ltr") {
			if (props.dir === "prev") {
				return props.activeRowIdx === 0;
			}
			//ltr next
			return props.activeRowIdx === props.htmlChaptersLength - 1;
		}
		if (props.dir === "prev") {
			//rtl prev
			return props.activeRowIdx === props.htmlChaptersLength - 1;
		}
		//rtl next
		return props.activeRowIdx === 0;
	};

	const flipForRTLIfNeeded = () => {
		if (props.langDirection === "rtl") {
			if (props.dir === "prev") {
				return "next";
			}
			return "prev";
		}
		return props.dir;
	};
	const onBtnClick = () => {
		changeActiveRow({
			activeRowIdx: props.activeRowIdx,
			dir: flipForRTLIfNeeded(),
			htmlChaptersLength: props.htmlChaptersLength,
			setter: props.setActiveContent,
		});
		if (globalThis.document) {
			// Which container is scrolling depends on viewport size, but scroll both back to top. Easier to break jsx flow and do it from here than pass a ref or somethign.
			const theText = document.querySelector("[data-js='theText']");

			const theContent = document.querySelector("[data-js='contentView']");
			const theCol = document.querySelector("[data-js='rightCol']");
			if (theText) {
				theText.scrollTop = 0;
			}
			if (theContent) {
				theContent.scrollTop = 0;
			}
			if (theCol) {
				theCol.scrollTop = 0;
			}
		}
	};
	return (
		<Switch>
			<Match when={props.dir === "prev"}>
				<button
					type="button"
					disabled={isDisabled()}
					class="md:inline-block hover:(text-brand-base) focus:(text-brand-base  ring-brand-base ring-inset-2) disabled:(cursor-not-allowed! opacity-50 text-gray-700)"
					onClick={onBtnClick}
					onMouseOver={() => {
						props.prefetchAdjacent(flipForRTLIfNeeded());
					}}
					onFocus={() => {
						props.prefetchAdjacent(flipForRTLIfNeeded());
					}}
					data-testid={`reader-nav-${flipForRTLIfNeeded()}`}
				>
					<span class=" i-ic:round-chevron-left w-1.5em h-1.5em" />
				</button>
			</Match>
			<Match when={props.dir === "next"}>
				<button
					type="button"
					disabled={isDisabled()}
					class=" md:inline-block hover:(text-brand-base) focus:(text-brand-base  ring-brand-base ring-inset-2)  disabled:(cursor-not-allowed! opacity-50 text-gray-700)"
					onClick={onBtnClick}
					onMouseOver={() => {
						props.prefetchAdjacent(flipForRTLIfNeeded());
					}}
					onFocus={() => {
						props.prefetchAdjacent(flipForRTLIfNeeded());
					}}
					data-testid={`reader-nav-${flipForRTLIfNeeded()}`}
				>
					<span class=" i-ic:round-chevron-right w-1.5em h-1.5em " />
				</button>
			</Match>
		</Switch>
	);
}

function TextOfResource(props: {
	text: Resource<string | null | undefined>;
	dict: i18nDictType;
}) {
	return (
		<div
			class="relative px-3 theText max-h-90% pb-16 overflow-y-auto md:(pb-auto max-h-unset)"
			data-css="theText"
			data-js="theText"
			data-testid="theText"
		>
			<Suspense
				fallback={
					<div
						id="theTextFallback "
						innerHTML={props.text.latest || props.dict.ls_Loading}
					/>
				}
			>
				<div innerHTML={props.text() || ""} />
			</Suspense>
		</div>
	);
}
