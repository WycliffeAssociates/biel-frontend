import type {Menu, MenuItem, languageType} from "@customTypes/types";
import {isAbsoluteUrl} from "@lib/web";
import {
  Show,
  createSignal,
  For,
  createEffect,
  type JSXElement,
  type Setter,
} from "solid-js";
import {WaLogo} from "./Logo";
import {
  ArrowRight,
  ChevronDown,
  CloseCircle,
  HamburgerMenuLines,
  LangGlobe,
} from "./Icons";
import {LanguagePickerMobile} from "./LanguagePicker";
import {FeaturedMenuItem} from "./HeaderMenu";
import {Search} from "@components/Search";

type HeaderMenuProps = {
  menu: Menu;
  allLangs: languageType[];
  currentLang: languageType;
  isBig: boolean;
};
export function HeaderMenuMobile(props: HeaderMenuProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activePane, setActivePane] = createSignal<number | string | null>();
  const [scrollPos, setScrollPost] = createSignal<number | null>();

  // todo: I think just opacity, or slide left/right tween between top menu and sub menu

  function closeMenu(e: KeyboardEvent) {
    if (e.key == "Escape" && isOpen()) {
      setIsOpen(false);
    }
  }
  function paneIsActive(idx: number | string) {
    //
    return idx == activePane();
  }
  function isAlsoParent(item: MenuItem) {
    return item.children?.length;
  }
  function shapeLink(item: MenuItem) {
    const link = item.attached_post?.uri || item.url;
    if (isAbsoluteUrl(link)) return link;
    if (props.currentLang.language_code == "en") {
      if (link.startsWith("/")) {
        return link;
      } else return `/${link}`;
    } else if (link.startsWith("/")) {
      return `/${props.currentLang.language_code}${link}`;
    } else return `/${props.currentLang.language_code}/${link}`;
  }

  createEffect(() => {
    if (!import.meta.env.SSR) {
      // src
      // https://markus.oberlehner.net/blog/simple-solution-to-prevent-body-scrolling-on-ios/
      if (isOpen()) {
        console.log("locking body simply");
        setScrollPost(window.scrollY);
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPos()}px`;
        document.body.style.width = "100%";
      } else {
        document.documentElement.style.overflow = "initial";
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        window.scrollTo(0, scrollPos() || 0);
      }
    }
  });

  // Render top level items:
  // Render Arrow.
  return (
    <div onkeydown={(e) => closeMenu(e)}>
      <nav class="relative pie-4 pis-4">
        <div class="flex justify-between items-center py-2 sm:text-blue">
          <a href="/" class="w-40 block">
            <WaLogo />
          </a>
          {/* search */}
          {/* hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen())}
            class="active:(outline-primary bg-none) hover:(!bg-transparent text-primary!) focus:(!bg-transparent outline-primary outline-1) icon  text-black!"
          >
            <Show when={!isOpen()} fallback={<CloseCircle />}>
              <HamburgerMenuLines class="fill-onSurface-secondary" />
            </Show>
          </button>
        </div>

        <Show when={isOpen()}>
          <div class="flex flex-col overflow-scroll z-10 h-screen overflow-y-auto pb-36">
            <ul class=" ">
              <For each={props.menu.items}>
                {(menuLink, index) => {
                  return (
                    <li
                      class="py-4 w-full flex justify-between content-center flex-shrink-0 last:(border-b border-surface-border pb-12)"
                      onClick={() => setActivePane(index())}
                    >
                      <span class="font-bold">{menuLink.title}</span>
                      <span class="inline-block transform -rotate-90">
                        <ChevronDown />
                      </span>
                      <Show when={paneIsActive(index())}>
                        <MobileNestedContainer>
                          <MobileNestedLayerTitleBar
                            text={menuLink.title}
                            paneSetter={() => setActivePane(null)}
                          />
                          <Show when={props.menu.featured_items}>
                            <ul class="flex flex-col gap-2 w-full pb-8 border-b border-b-surface-border">
                              <For each={props.menu.featured_items}>
                                {(featured) => (
                                  <FeaturedMenuItem
                                    featured={featured}
                                    shapeLink={shapeLink}
                                  />
                                )}
                              </For>
                            </ul>
                          </Show>
                          <Show when={props.menu.non_featured_items}>
                            <ul class="flex flex-col gap-2 w-full">
                              <For each={props.menu.non_featured_items}>
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
                        </MobileNestedContainer>
                      </Show>
                    </li>
                  );
                }}
              </For>
            </ul>
            <div class="pt-4">
              <button
                class="p-3 flex w-full items-center justify-between active:(bg-brand-base text-surface-invert) border border-surface-border rounded-lg"
                onClick={() => setActivePane("language")}
              >
                <span class="flex gap-2">
                  <LangGlobe />
                  {props.currentLang.native_name}
                </span>
                <span>
                  <ArrowRight />
                </span>
              </button>
              <div class="mt-4">
                <Search langCode={props.currentLang.language_code} />
              </div>
              <Show when={paneIsActive("language")}>
                <MobileNestedContainer>
                  <MobileNestedLayerTitleBar
                    paneSetter={() => setActivePane(null)}
                    text={props.currentLang.native_name}
                  />
                  <LanguagePickerMobile
                    allLangs={props.allLangs}
                    currentLang={props.currentLang}
                  />
                </MobileNestedContainer>
              </Show>
              {/* <LanguagePickerMobile/> */}
            </div>
          </div>
        </Show>
      </nav>
    </div>
  );
}

type leafNodeProps = {
  menuItem: MenuItem;
  href: string;
};
function LeafNode(props: leafNodeProps) {
  return (
    <a class="flex flex-col" href={props.href}>
      <span class={"font-bold"}>{props.menuItem.title}</span>
      <span>{props.menuItem.description || "Lorem text for leaf here"}</span>
    </a>
  );
}

type nestedNodeProps = {
  children: JSXElement;
};

function MobileNestedContainer(props: nestedNodeProps) {
  return (
    <div class="absolute top-0 left-0 bg-white z-10 h-screen overflow-auto w-full pie-4 pis-4">
      {props.children}
    </div>
  );
}
type MobileNestedLayerTitleBarProps = {
  paneSetter: Setter<null>;
  text: string;
};
function MobileNestedLayerTitleBar(props: MobileNestedLayerTitleBarProps) {
  return (
    <div class=" w-full py-4">
      <div class="flex gap-6 w-full">
        <button class="" onClick={props.paneSetter}>
          <span class="block transform rotate-90 color-onSurface-secondary text-lg">
            <ChevronDown />
          </span>
        </button>
        <h2 class="text-black text-lg font-bold">{props.text}</h2>
      </div>
    </div>
  );
}
