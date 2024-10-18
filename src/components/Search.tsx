import {MangifyingGlass} from "@components/Icons";
import {getDict, type i18nDictType} from "@src/i18n/strings.js";
// Import necessary modules from SolidJS
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  batch,
  onMount,
  type Accessor,
  type Setter,
} from "solid-js";
import {groupBy} from "ramda";
import {constants} from "@lib/constants.js";
import type {languageType} from "@customTypes/types.js";

type SearchProps = {
  langCode: string;
  isBig?: boolean;
  addlClasses?: string;
  isSearchPage?: boolean;
  langSwitcherList: languageType[];
};
// Define the Search component
export function Search(props: SearchProps) {
  const dict = getDict(props.langCode, true)!;
  const [query, setQuery] = createSignal("");
  // biome-ignore lint/suspicious/noExplicitAny: <not sure on pagefind type>
  const [results, setResults] = createSignal<Partial<Record<any, any[]>>>();
  const [searchFocused, setSearchFocused] = createSignal(false);
  const [isTyping, setIsTyping] = createSignal(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [isTypingTimeout, setIsTypingTimeout] = createSignal<any>(null);

  const mobileClassNames = "mobile";
  const bigClassNames =
    "absolute top-full  z-10 bg-white px-14 pbs-4 pbe-10 max-h-80vh overflow-auto w-[clamp(min(99vw,270px),50vw,500px)] right-0  ";

  onMount(async () => {
    // eagerly fetch this
    // @ts-ignore
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const pageFind = (await import("../pagefind/pagefind.js")) as any;
    pageFind.init();
    await pageFind.options({
      excerptLength: 5,

      baseUrl: "/",
    });

    window.pagefind = pageFind;

    document.body.addEventListener("click", (e) => {
      const el = e.target as HTMLElement;
      const isSearchPage = Boolean(
        document.querySelector(
          `[data-js="${constants.searchAsPageQuerySelector}"]`
        )
      );
      if (
        !el.closest("[data-js='search']") &&
        !el.closest("[data-js='search-page-tab-button']") &&
        !isSearchPage
      ) {
        setQuery("");
        setResults(undefined);
        setSearchFocused(false);
      }
    });

    // @ts-ignore
    if (!document.body.alreadyListeningKeydown) {
      document.body.addEventListener("keydown", (e) => {
        const focusedEl = document.activeElement;
        // @ts-ignore
        const datajsAttr = focusedEl?.dataset?.js;
        let allOfThisType = null;
        let currentIdx = null;
        if (datajsAttr) {
          allOfThisType = Array.from(
            document.querySelectorAll(`[data-js="${datajsAttr}"]`)
          );
          currentIdx = allOfThisType.indexOf(focusedEl);
        }
        if (e.key === "Escape") {
          setQuery("");
          setResults(undefined);
          setSearchFocused(false);
        }
        if (e.key === "ArrowDown") {
          if (
            currentIdx !== null &&
            allOfThisType &&
            currentIdx < allOfThisType.length - 1 &&
            allOfThisType[currentIdx + 1]
          ) {
            const nextEl = allOfThisType[currentIdx + 1] as HTMLElement;
            nextEl.focus();
          }
        }
        if (e.key === "ArrowUp") {
          if (
            currentIdx !== null &&
            allOfThisType &&
            currentIdx > 0 &&
            allOfThisType[currentIdx - 1]
          ) {
            const nextEl = allOfThisType[currentIdx - 1] as HTMLElement;
            nextEl.focus();
          }
        }
      });
      // @ts-ignore
      document.body.alreadyListeningKeydown = true;
    }
  });

  function escapeSearch() {
    setQuery("");
    setResults(undefined);
    setSearchFocused(false);
  }
  type handleInputArgs = {
    event?: KeyboardEvent;
    stringToSearch?: string;
  };
  const handleInput = async ({event, stringToSearch}: handleInputArgs) => {
    if (!event && !stringToSearch) return;
    if (event?.key) {
      const curTimeout = isTypingTimeout();
      if (curTimeout) {
        clearTimeout(curTimeout);
      }
      const to = setTimeout(() => {
        setIsTyping(false);
      }, 250);
      setIsTypingTimeout(to);
    }
    if (event?.key && event.key === "Escape") {
      setQuery("");
      setResults(undefined);
      setSearchFocused(false);
    }

    const inputValue =
      // @ts-ignore
      stringToSearch || (event?.target?.value as HTMLInputElement);

    if (!inputValue) setResults();
    if (!import.meta.env.SSR) {
      //@ts-ignore
      // Load the pagefind script only once
      if (!window.pagefind) {
        //@ts-ignore
        window.pagefind = await import("../pagefind/pagefind.js");
      }
      // Search the index using the input value
      const search = await window.pagefind.debouncedSearch(inputValue, {}, 50);

      // Add the new results
      // biome-ignore lint/suspicious/noExplicitAny: <not sure on pagefind type>
      const res: any[] = [];

      if (!search?.results.length) {
        return setResults(undefined);
      }

      // no more than 30 results likely needed on this small a site
      for (const result of search.results.slice(0, 30)) {
        const data = await result.data();
        res.push(data);
      }
      const grouped = groupBy((result) => result.meta.type, res);
      setResults(grouped);
    }
  };

  const suggestLocalizeSite = () => {
    if (!props.langSwitcherList || !query()) {
      return undefined;
    }
    const queryLower = query().toLowerCase();
    const suggestions = props.langSwitcherList.filter((l) => {
      const notCurrentLang = l.code !== props.langCode;
      const nativeNameInclude = l.native_name
        .toLowerCase()
        .startsWith(queryLower);
      const anclicizedNameInclude = l.translated_name
        .toLowerCase()
        .startsWith(queryLower);
      return notCurrentLang && (nativeNameInclude || anclicizedNameInclude);
    });
    return suggestions;
  };
  const setSearchRefValue = (value: string) => {
    setQuery(value);
    handleInput({stringToSearch: value});
  };

  onCleanup(() => {
    if (!import.meta.env.SSR && window.pagefind) {
      window.pagefind.destroy();
    }
  });

  return (
    <>
      <Show when={!props.isSearchPage}>
        {/* Input element for search */}
        <div class={"relative"} data-js="searchWrapper">
          <input
            class={
              "border border-surface-border! p-4  rounded-2xl bg-white!  placeholder:(text-#777 font-bold) w-full"
            }
            onFocus={() => {
              setSearchFocused(true);
            }}
            onBlur={(e) => {
              const searchWrapper = e.target.closest(
                "[data-js='searchWrapper']"
              );

              if (!searchWrapper) {
                setSearchFocused(false);
              }
            }}
            id="search"
            data-js="search"
            type="search"
            placeholder={dict.search}
            value={query()}
            onInput={(e) => {
              batch(() => {
                setIsTyping(true);
                setQuery(e.target.value);
              });
            }}
            onKeyUp={(e) => handleInput({event: e})}
            // @ts-ignore chrome only
            onSearch={handleInput}
          />
          <MangifyingGlass class="absolute top-1/2 translate-y-[-50%] end-2" />

          {/* Container for search results */}
          <Show when={!query() && searchFocused()}>
            <div
              data-js="searchSuggestions"
              class={`${props.isBig ? bigClassNames : mobileClassNames} ${
                props.addlClasses
              }  shadow-lg shadow-dark rounded-2xl `}
            >
              <h3 class="font-500 font-step-1 text-onSurface-secondary">
                {dict.searchIdeas}
              </h3>
              <ul class="list-none">
                <For
                  each={[
                    dict.searchSuggestion1PageLabel,
                    dict.searchSuggestion2SoftwareLabel,
                    dict.searchSuggestion3ResourceLabel,
                  ]}
                >
                  {(l) => (
                    <SearchSuggestionBtn
                      label={l}
                      onClick={setSearchRefValue}
                    />
                  )}
                </For>
              </ul>
            </div>
          </Show>
          <Show when={query() && !results() && !isTyping()}>
            <div
              data-js="searchSuggestions"
              class={`${props.isBig ? bigClassNames : mobileClassNames} ${
                props.addlClasses
              }  shadow-lg shadow-dark rounded-2xl `}
            >
              {dict.searchNotFound.replace(/\{\{([^}]*)\}\}/, query())}
            </div>
          </Show>
          <Show when={results() && query()}>
            <div
              data-js="searchResults"
              class={`${props.isBig ? bigClassNames : mobileClassNames} ${
                props.addlClasses
              } searchResults shadow-lg shadow-dark rounded-2xl`}
            >
              <LocalizeActions
                suggestLocalizeSiteOptions={suggestLocalizeSite}
                dict={dict}
              />
              <ul class="list-none! flex flex-col gap-4">
                <Show when={results()?.page}>
                  <SearchSectionTitle title={dict.pages} />
                  <ul class="list-none! flex flex-col gap-2">
                    <For each={results()?.page?.slice(0, 5)}>
                      {(item) => (
                        <SearchItem escapeSearch={escapeSearch} item={item} />
                      )}
                    </For>
                  </ul>
                </Show>
                <Show when={results()?.software}>
                  <SearchSectionTitle title={dict.software} />

                  <ul class="list-none! flex flex-col gap-2">
                    <For each={results()?.software}>
                      {(item) => (
                        <SearchItem escapeSearch={escapeSearch} item={item} />
                      )}
                    </For>
                  </ul>
                </Show>
                <Show when={results()?.resource}>
                  <SearchSectionTitle title={dict.resources} />
                  <ul class="list-none! flex flex-col gap-2">
                    <For each={results()?.resource?.slice(0, 5)}>
                      {(item) => (
                        <SearchItem escapeSearch={escapeSearch} item={item} />
                      )}
                    </For>
                  </ul>
                </Show>
              </ul>
            </div>
          </Show>
        </div>
      </Show>
      <Show when={props.isSearchPage}>
        <SearchAsPage
          escapeSearch={escapeSearch}
          dict={dict}
          handleInput={(e) => handleInput({event: e})}
          query={query}
          results={results}
          setQuery={setQuery}
          setResults={setResults}
          suggestLocalizeSiteOptions={suggestLocalizeSite}
          langCode={props.langCode}
        />
      </Show>
    </>
  );
}

function SearchSectionTitle(props: {title: string}) {
  return (
    <h3 class="font-step-1 font-600! text-onSurface-secondary!">
      {props.title}
    </h3>
  );
}
function SearchSuggestionBtn(props: {
  label: string;
  onClick: (label: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        data-js="searchSuggestionBtn"
        class="w-full font-350 text-left focus:(bg-brand-light) hover:(text-brand-base font-500) py-2 text-onSurface-secondary"
        onClick={() => props.onClick(props.label)}
      >
        {props.label}
      </button>
    </li>
  );
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function SearchItem(props: {item: any; escapeSearch: () => void}) {
  return (
    <Switch>
      <Match when={props.item.meta.type && props.item.meta.type !== "software"}>
        <li
          class="font-step--1 cursor-pointer hover:(bg-brand-light) "
          onClick={() => window.open(props.item.url)}
          onKeyDown={(e) => e.key === "Enter" && window.open(props.item.url)}
        >
          <p class="text-base!  text-onSurface-primary">
            <a
              data-js="searchResult"
              class="decoration-none! font-bold focus:(ring ring-brand-base ring-offset-2 outline-none)  py-1"
              href={props.item.url}
              onKeyDown={(e) => e.key === "Escape" && props.escapeSearch()}
            >
              {props.item.meta.title}
            </a>
          </p>
          <div class="flex">
            <p
              class="color-onSurface-secondary!"
              innerHTML={props.item.excerpt}
            />
            <Show
              when={props.item.meta.type && props.item.meta.type === "software"}
            >
              <span>{props.item.meta.download}</span>
            </Show>
          </div>
        </li>
      </Match>
      <Match when={props.item.meta.type && props.item.meta.type === "software"}>
        <SearchItemSoftware
          item={props.item}
          escapeSearch={props.escapeSearch}
        />
      </Match>
    </Switch>
  );
}

type SearchItemSoftwareProps = {
  escapeSearch: () => void;
  item: {
    url: string;
    excerpt: string;
    title: string;
    type: string;
    meta: {
      type: string;
      title: string;
      platform: string;
      download: string;
    };
  };
};
function SearchItemSoftware(props: SearchItemSoftwareProps) {
  return (
    <li
      class="py-1 hover:(bg-brand-light)"
      onClick={() => window.open(props.item.url)}
      onKeyDown={(e) => e.key === "Enter" && window.open(props.item.url)}
    >
      <p class="text-base! cursor-pointer text-[var(--color-accent)] flex justify-between items-center focus-within:(ring ring-brand-base ring-offset-2 outline-none)">
        <span class="flex gap-2 items-center">
          <Switch>
            <Match when={props.item.meta.platform === "Mac"}>
              <span class="i-iconoir:apple-mac w-1em h-1em" />
            </Match>
            <Match when={props.item.meta.platform === "Windows"}>
              <span class="i-iconoir:windows w-1em h-1em" />
            </Match>
            <Match when={props.item.meta.platform === "Linux"}>
              <span class="i-ant-design:linux-outlined w-1em h-1em" />
            </Match>
          </Switch>
          {props.item.meta.download}
        </span>
        <a
          data-js="searchResult"
          class="decoration-none! focus:(outline-none)"
          href={props.item.url}
          onKeyDown={(e) => e.key === "Escape" && props.escapeSearch()}
        >
          <span class="i-material-symbols:download w-1em h-1em" />
        </a>
      </p>
    </li>
  );
}

type SearchAsPageProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  results: Accessor<Partial<Record<any, any[]>> | undefined>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setResults: Setter<Partial<Record<any, any[]>> | undefined>;
  query: Accessor<string>;
  setQuery: Setter<string>;
  dict: i18nDictType;
  handleInput: (e: KeyboardEvent) => Promise<void>;
  suggestLocalizeSiteOptions: () => languageType[] | undefined;
  langCode: string;
  escapeSearch: () => void;
};
function SearchAsPage(props: SearchAsPageProps) {
  const [tabActive, setTabActive] = createSignal<
    "PAGES" | "SOFTWARE" | "RESOURCES"
  >("PAGES");
  const changeTab = (tab: "PAGES" | "SOFTWARE" | "RESOURCES") => {
    setTabActive(tab);
  };
  function buttonLabel(length: number | undefined) {
    if (length === undefined) {
      return "";
    }

    return `(${length})`;
  }

  return (
    <div class="pbs-8 relative" data-js={constants.searchAsPageQuerySelector}>
      <div class="relative">
        <input
          class={
            "border border-surface-border! p-4 rounded-2xl bg-white! pis-10 placeholder:(text-#777 font-bold) w-full cursor-pointer"
          }
          id="search"
          data-js="search"
          type="search"
          placeholder={props.dict.search}
          value={props.query()}
          onInput={(e) => {
            props.setQuery(e.target.value);
          }}
          onKeyUp={(e) => {
            props.handleInput(e);
          }}
          // @ts-ignore chrome only
          onSearch={(e) => {
            props.handleInput(e);
          }}
        />
        <ul class="flex list-none! pbs-4">
          <For
            each={[
              [
                "PAGES",
                `${props.dict.pages} ${buttonLabel(
                  props.results()?.page?.length
                )}`,
              ],
              [
                "RESOURCES",
                `${props.dict.resources} ${buttonLabel(
                  props.results()?.resource?.length
                )}`,
              ],
              [
                "SOFTWARE",
                `${props.dict.software} ${buttonLabel(
                  props.results()?.software?.length
                )}`,
              ],
            ]}
          >
            {(tab) => (
              <SearchPageTabButton
                dictEntry={tab[1]!}
                onClick={() => {
                  changeTab(tab[0]! as "PAGES" | "SOFTWARE" | "RESOURCES");
                }}
                classes={`${
                  tabActive() === tab[0]! &&
                  "text-brand-base! border-b border-solid border-b-brand-base"
                } px-3 `}
              />
            )}
          </For>
        </ul>

        <div class="mbs-8">
          {/* actions */}
          <LocalizeActions
            suggestLocalizeSiteOptions={props.suggestLocalizeSiteOptions}
            dict={props.dict}
          />

          {/* search results */}
          <ul class="list-none! flex flex-col gap-2 pbs-4 min-h-screen searchResults">
            <Switch>
              <Match when={tabActive() === "PAGES"}>
                <For each={props.results()?.page || []}>
                  {(item) => (
                    <SearchPageResultItem
                      escapeSearch={props.escapeSearch}
                      item={item}
                    />
                  )}
                </For>
              </Match>
              <Match when={tabActive() === "RESOURCES"}>
                <For each={props.results()?.resource || []}>
                  {(item) => (
                    <SearchPageResultItem
                      escapeSearch={props.escapeSearch}
                      item={item}
                    />
                  )}
                </For>
              </Match>
              <Match when={tabActive() === "SOFTWARE"}>
                <For each={props.results()?.software || []}>
                  {(item) => (
                    <SearchPageResultItem
                      escapeSearch={props.escapeSearch}
                      item={item}
                    />
                  )}
                </For>
              </Match>
            </Switch>
          </ul>
        </div>
      </div>
    </div>
  );
}

type SearchPageTabButtonProps = {
  onClick: () => void;
  dictEntry: string;
  classes?: string;
};
function SearchPageTabButton(props: SearchPageTabButtonProps) {
  return (
    <li>
      <button
        data-js="search-page-tab-button"
        type="button"
        onClick={props.onClick}
        class={`${props.classes}`}
      >
        {props.dictEntry}
      </button>
    </li>
  );
}
function SearchPageResultItem(props: SearchItemSoftwareProps) {
  return (
    <li>
      <div>
        <a href={props.item.url} class="font-bold">
          {props.item.meta.title}
          <Show when={props.item.meta.type?.toLowerCase() === "software"}>
            <span class="text-sm font-400 font-italic pis-4 inline-flex gap-2 items-center">
              ({props.item.meta.download}){" "}
              <InlineSoftwareIcon item={props.item} />
            </span>
          </Show>
        </a>
        <Show when={props.item.excerpt}>
          <p innerHTML={props.item.excerpt} />
        </Show>
      </div>
    </li>
  );
}

function InlineSoftwareIcon(
  props: Omit<SearchItemSoftwareProps, "escapeSearch">
) {
  return (
    <Switch>
      <Match when={props.item.meta.platform === "Mac"}>
        <span class="i-iconoir:apple-mac w-1em h-1em" />
      </Match>
      <Match when={props.item.meta.platform === "Windows"}>
        <a class="decoration-none!" href={props.item.url}>
          <span class="i-iconoir:windows w-1em h-1em" />
        </a>
      </Match>
      <Match when={props.item.meta.platform === "Linux"}>
        <span class="i-ant-design:linux-outlined w-1em h-1em" />
      </Match>
    </Switch>
  );
}

type LocalizeActionsProps = {
  suggestLocalizeSiteOptions: () => languageType[] | undefined;
  dict: i18nDictType;
};
function LocalizeActions(props: LocalizeActionsProps) {
  return (
    <Show when={props.suggestLocalizeSiteOptions()}>
      <ul class="flex gap-2 flex-wrap list-none!">
        <For each={props.suggestLocalizeSiteOptions()}>
          {(l) => (
            <li>
              <a
                data-js="searchResult"
                class="bg-surface-tertiary px-2 py-1 rounded-2xl decoration-none! inline-flex items-center gap-2 hover:(bg-brand-base text-brand-light) focus:(bg-brand-base text-brand-light) cursor-pointer"
                href={l.localizedUrl!}
              >
                <span class="i-circum:globe w-1em h-1em" />
                {props.dict.localizeTo} {l.native_name}{" "}
                <span class="text-xs">({l.translated_name})</span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}
