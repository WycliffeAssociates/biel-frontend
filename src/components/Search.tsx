import {MangifyingGlass} from "@components/Icons";
import {getDict} from "@src/i18n/strings.js";
// Import necessary modules from SolidJS
import {
  For,
  Match,
  Show,
  Switch,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import {groupBy} from "ramda";

type SearchProps = {
  langCode: string;
  isBig?: boolean;
  injected?: boolean;
  addlClasses?: string;
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
      excerptLength: 3,

      baseUrl: "/",
    });
    window.pagefind = pageFind;

    document.body.addEventListener("click", (e) => {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-js='search']")) {
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
  onCleanup(() => {
    if (!import.meta.env.SSR && window.pagefind) {
      window.pagefind.destroy();
    }
  });

  return (
    <>
      {/* Input element for search */}
      <div class={"relative"} data-injected-search={props.injected}>
        <input
          class={`border border-surface-border! px-2 py-2 rounded-lg bg-white! pis-10 placeholder:(text-#777 font-bold) w-full ${
            results() && props.injected
              ? "border-t-0 border-b-1  border-l-0 border-r-0 rounded-bl-0! rounded-br-0! outline-none"
              : ""
          }`}
          id="search"
          data-js="search"
          type="search"
          // onFocus={(e) => {
          //   window.pagefind.init();
          // }}
          placeholder={dict.search}
          value={query()}
          onInput={(e) => setQuery(e.target.value)}
          onKeyUp={handleInput}
          // @ts-ignore chrome only
          onSearch={handleInput}
        />
        <MangifyingGlass class="absolute start-2 top-2" />

        {/* Container for search results */}
        <Show when={results() && query()}>
          <div
            class={`${props.isBig ? bigClassNames : mobileClassNames} ${
              props.addlClasses
            } searchResults shadow-lg`}
          >
            <Show when={results()?.page}>
              <h3 class="font-size-[var(--step-1)]! font-400! text-onSurface-secondary!">
                {dict.pages}
              </h3>
              <ul class="list-none!">
                <For each={results()?.page?.slice(0, 5)}>
                  {(item) => <SearchItem item={item} />}
                </For>
              </ul>
            </Show>
            <Show when={results()?.resource}>
              <h3 class="font-size-[var(--step-1)]! font-400! text-onSurface-secondary!">
                {dict.resources}
              </h3>
              <ul class="list-none!">
                <For each={results()?.resource?.slice(0, 5)}>
                  {(item) => <SearchItem item={item} />}
                </For>
              </ul>
            </Show>
            <Show when={results()?.software}>
              <h3 class="font-size-[var(--step-1)]! font-400! text-onSurface-secondary!">
                {dict.software}
              </h3>
              <ul class="list-none!">
                <For each={results()?.software}>
                  {(item) => <SearchItem item={item} />}
                </For>
              </ul>
            </Show>
          </div>
        </Show>
      </div>
    </>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function SearchItem(props: {item: any}) {
  return (
    <Switch>
      <Match when={props.item.meta.type && props.item.meta.type !== "software"}>
        <li class="py-1">
          <p class="text-base! cursor-pointer text-[var(--color-accent)]">
            <a class="decoration-none!" href={props.item.url}>
              {props.item.meta.title}
            </a>
          </p>
          <div class="flex">
            <p
              class="color-onSurface-secondary font-size-[var(--step--1)]!"
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
function SearchItemSoftware(props: {item: any}) {
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
