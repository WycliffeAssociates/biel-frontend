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
  injected?: boolean;
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
  const mobileClassNames = "mobile";
  const bigClassNames =
    "absolute top-full  z-10 bg-white p-3 max-h-500px overflow-auto w-[clamp(min(99vw,270px),50vw,500px)] right-0  ";

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
      }
    });

    document.body.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setQuery("");
        setResults(undefined);
      }
    });
  });
  const handleInput = async (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const inputValue = target?.value;
    if (!inputValue) setResults();
    if (!import.meta.env.SSR) {
      //@ts-ignore
      // Load the pagefind script only once
      if (!window.pagefind) {
        //@ts-ignore
        window.pagefind = await import("../pagefind/pagefind.js");
      }
      // Search the index using the input value
      const search = await window.pagefind.debouncedSearch(inputValue, {}, 100);

      // Add the new results
      // biome-ignore lint/suspicious/noExplicitAny: <not sure on pagefind type>
      const res: any[] = [];
      if (search?.results) {
        for (const result of search.results) {
          const data = await result.data();
          res.push(data);
        }
        console.log(res);
        const grouped = groupBy((result) => result.meta.type, res);
        console.log({grouped});
        setResults(grouped);
      }
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

  onCleanup(() => {
    if (!import.meta.env.SSR && window.pagefind) {
      window.pagefind.destroy();
    }
  });

  return (
    <>
      <Show when={!props.isSearchPage}>
        {/* Input element for search */}
        <div class={"relative"} data-injected-search={props.injected}>
          <input
            class={`border border-surface-border! p-4  rounded-2xl bg-white!  placeholder:(text-#777 font-bold) w-full ${
              results() && props.injected
                ? "border-t-0 border-b-1  border-l-0 border-r-0 rounded-bl-0! rounded-br-0! outline-none"
                : ""
            }`}
            id="search"
            data-js="search"
            type="search"
            placeholder={dict.search}
            value={query()}
            onInput={(e) => setQuery(e.target.value)}
            onKeyUp={handleInput}
            // @ts-ignore chrome only
            onSearch={handleInput}
          />
          <MangifyingGlass class="absolute top-1/2 translate-y-[-50%] end-2" />

          {/* Container for search results */}
          <Show when={results() && query()}>
            <div
              class={`${props.isBig ? bigClassNames : mobileClassNames} ${
                props.addlClasses
              } searchResults shadow-lg shadow-dark rounded-2xl`}
            >
              <LocalizeActions
                suggestLocalizeSiteOptions={suggestLocalizeSite}
                dict={dict}
              />
              <Show when={results()?.page}>
                <h3 class="font-size-[var(--step-0)]! font-400! text-onSurface-secondary!">
                  {dict.pages}
                </h3>
                <ul class="list-none!">
                  <For each={results()?.page?.slice(0, 5)}>
                    {(item) => <SearchItem item={item} />}
                  </For>
                </ul>
              </Show>
              <Show when={results()?.software}>
                <h3 class="font-size-[var(--step-0)]! font-400! text-onSurface-secondary!">
                  {dict.software}
                </h3>
                <ul class="list-none!">
                  <For each={results()?.software}>
                    {(item) => <SearchItem item={item} />}
                  </For>
                </ul>
              </Show>
              <Show when={results()?.resource}>
                <h3 class="font-size-[var(--step-0)]! font-400! text-onSurface-secondary!">
                  {dict.resources}
                </h3>
                <ul class="list-none!">
                  <For each={results()?.resource?.slice(0, 5)}>
                    {(item) => <SearchItem item={item} />}
                  </For>
                </ul>
              </Show>
            </div>
          </Show>
        </div>
      </Show>
      <Show when={props.isSearchPage}>
        <SearchAsPage
          dict={dict}
          handleInput={handleInput}
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function SearchItem(props: {item: any}) {
  return (
    <Switch>
      <Match when={props.item.meta.type && props.item.meta.type !== "software"}>
        <li class="py-1">
          <p class="text-base! cursor-pointer text-onSurface-primary">
            <a class="decoration-none! font-bold" href={props.item.url}>
              {props.item.meta.title}
            </a>
          </p>
          <div class="flex">
            <p
              class="color-onSurface-secondary font-size-[var(--step--1)]! text-sm"
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
        <SearchItemSoftware item={props.item} />
      </Match>
    </Switch>
  );
}

type SearchItemSoftwareProps = {
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
    <li class="py-1">
      <p class="text-base! cursor-pointer text-[var(--color-accent)] flex justify-between items-center">
        <span class="flex gap-2 items-center">
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
          {props.item.meta.download}
        </span>
        <a class="decoration-none!" href={props.item.url}>
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
            "border border-surface-border! p-4 rounded-2xl bg-white! pis-10 placeholder:(text-#777 font-bold) w-full"
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
                  {(item) => <SearchPageResultItem item={item} />}
                </For>
              </Match>
              <Match when={tabActive() === "RESOURCES"}>
                <For each={props.results()?.resource || []}>
                  {(item) => <SearchPageResultItem item={item} />}
                </For>
              </Match>
              <Match when={tabActive() === "SOFTWARE"}>
                <For each={props.results()?.software || []}>
                  {(item) => <SearchPageResultItem item={item} />}
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

function InlineSoftwareIcon(props: SearchItemSoftwareProps) {
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
