import { ChevronDown, SmallArrowDown } from "@components/Icons";
import { Search } from "@components/Search";
import type { Menu, MenuItem, languageType } from "@customTypes/types";
import { isAbsoluteUrl } from "@lib/web";
import { createMediaQuery } from "@solid-primitives/media";
import type { i18nDictType } from "@src/i18n/strings";
import { For, Show, createSignal } from "solid-js";
import { HeaderMenuMobile } from "./HeaderMenuMobile";
import { LanguagePicker } from "./LanguagePicker";
import { WaLogo } from "./Logo";

type HeaderMenuProps = {
	menu: Menu;
	allLangs: languageType[];
	currentLang: languageType;
	i18nDict: i18nDictType;
};
export function HeaderMenu(props: HeaderMenuProps) {
	const [activeIdx, setActiveIdx] = createSignal<number | null>();
	const isBig = createMediaQuery("(min-width: 900px)", true);

	function shapeLink(item: MenuItem) {
		const link = item.attached_post?.uri || item.url;
		if (isAbsoluteUrl(link)) return link;
		if (props.currentLang.language_code === "en") {
			if (link.startsWith("/")) {
				return link;
			}
			return `/${link}`;
		}
		if (link.startsWith("/")) {
			return `/${props.currentLang.language_code}${link}`;
		}
		return `/${props.currentLang.language_code}/${link}`;
	}
	function paneIsActive(idx: number) {
		//
		return idx === activeIdx();
	}
	function isParent(item: MenuItem) {
		return !!item.children;
	}

	return (
		<nav data-pagefind-ignore="all">
			<Show when={!isBig()}>
				<HeaderMenuMobile
					menu={props.menu}
					allLangs={props.allLangs}
					currentLang={props.currentLang}
					isBig={isBig()}
					i18nDict={props.i18nDict}
				/>
			</Show>
			<Show when={isBig()}>
				<div class="relative">
					<nav
						class="relative p-4 flex items-center justify-between z-20 contain contain-pad h-20"
						onBlur={() => setActiveIdx(null)}
						onMouseLeave={() => setActiveIdx(null)}
					>
						<div class="flex items-center">
							<a
								href={`${
									props.currentLang.code === "en"
										? "/"
										: `/${props.currentLang.language_code}`.replace("//", "/")
								}`}
								class="w-40 "
							>
								<WaLogo />
							</a>
							{/* nave items */}
							<ul class="flex list-none gap-4 p-0">
								{/* top level */}
								<For each={props.menu?.items}>
									{(menuLink, index) => {
										return (
											<li class="group text-onSurface-secondary font-wdth-90">
												{/* top level info */}
												<span class="inline-block hover:bg-brand-light rounded-2xl">
													<button
														data-testid="header-menu-item"
														class="font-500 font-step-0  group-has-[:hover]:(text-brand-base) rounded-2xl focus:(text-brand-base) inline-flex gap-2 items-center p-4"
														type="button"
														onFocus={() => setActiveIdx(index)}
														onClick={() => setActiveIdx(index)}
														// href={`${shapeLink(menuLink)}`}
													>
														<span innerHTML={menuLink.title} />
														<Show when={isParent(menuLink)}>
															<SmallArrowDown />
														</Show>
													</button>
												</span>
												{/* nested pane */}
												<Show
													when={isParent(menuLink) && paneIsActive(index())}
												>
													<div
														data-testid="header-menu-pane"
														class="bg-surface-primary  absolute top-20 left-0 w-screen mis-[min(0px,_calc(var(--site-container-max)-100vw-1rem)/2)] shadow-menu"
													>
														<div class="contain contain-pad py-4 flex gap-10">
															<div class="p-4 flex flex-col gap-2 w-1/4">
																<div class="flex gap-2 items-center">
																	<Show when={menuLink.icon}>
																		<span
																			class="w-6 icon text-brand-base"
																			innerHTML={menuLink.icon}
																		/>
																	</Show>
																	<a href={shapeLink(menuLink)}>
																		<h2 class="text-brand-base font-size-[var(--step-1)] font-bold underline flex gap-2px">
																			{menuLink.title}
																		</h2>
																	</a>
																</div>
																<p>{menuLink.parent_description}</p>
															</div>
															<Show when={menuLink.children?.featured}>
																<ul class="flex flex-col gap-2 w-1/2">
																	<For each={menuLink.children?.featured}>
																		{(featured) => (
																			<FeaturedMenuItem
																				featured={featured}
																				shapeLink={shapeLink}
																			/>
																		)}
																	</For>
																</ul>
															</Show>
															<Show when={menuLink.children?.non_featured}>
																<ul class="flex flex-col gap-2 w-1/4">
																	<For each={menuLink.children?.non_featured}>
																		{(nonFeatured) => (
																			<li>
																				<a
																					class="w-full flex py-2 justify-between hover:(bg-surface-secondary) rounded-xl p-2"
																					href={shapeLink(nonFeatured)}
																				>
																					{nonFeatured.title}
																					<span class="block transform -rotate-90 color-onSurface-tertiary font-size-[var(--step--2)]">
																						<ChevronDown />
																					</span>
																				</a>
																			</li>
																		)}
																	</For>
																</ul>
															</Show>
														</div>
													</div>
												</Show>
											</li>
										);
									}}
								</For>
							</ul>
						</div>
						<div class="flex items-center gap-2">
							<Search
								langCode={props.currentLang.language_code}
								isBig={isBig()}
								langSwitcherList={props.allLangs}
							/>
							<LanguagePicker
								allLangs={props.allLangs}
								currentLang={props.currentLang}
							/>
						</div>
					</nav>
					{/* for html sematnnci, the nav is nested, but we the white backround to cover width of screen */}
					{/* <div class="cover w-full bg-surface-primary absolute h-screen" /> */}
				</div>
			</Show>
		</nav>
	);
}

type FeaturedMenuItemProps = {
	shapeLink: (link: MenuItem) => string;
	featured: MenuItem;
};
export function FeaturedMenuItem(props: FeaturedMenuItemProps) {
	return (
		<li>
			<a
				class="p-4 rounded-lg flex flex-col justify-center bg-brand-light hover:(bg-brand-base text-onSurface-invert) group/featured"
				href={props.shapeLink(props.featured)}
			>
				<h3 class="flex gap-2 text-brand-base group-hover/featured:text-inherit! font-size-[var(--step-1)]">
					<Show when={props.featured.icon}>
						<span
							class="w-6 text-inherit icon [&_path]:(text-inherit! fill-current) "
							innerHTML={props.featured.icon}
						/>
					</Show>
					{props.featured.title}
				</h3>
				<p class="flex items-baseline justify-between">
					<span class="block max-w-95%">
						{props.featured.featured_description}
					</span>
					<span class="block transform -rotate-90 color-onSurface-tertiary font-size-[var(--step--2)]">
						<ChevronDown />
					</span>
				</p>
			</a>
		</li>
	);
}
