// Import necessary modules from SolidJS
import {For, Show, createSignal, onCleanup} from "solid-js";
import {getDict} from "@src/i18n/strings.js";
import {MangifyingGlass} from "@components/Icons";

type SearchProps = {
  langCode: string;
  isBig?: boolean;
};
// Define the Search component
export function Search(props: SearchProps) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<any[]>([]);
  const commonClassNames = "";
  const mobileClassNames = `mobile`;
  const bigClassNames = `absolute top-full  z-10 bg-white p-3 max-h-500px overflow-auto w-[clamp(min(99vw,270px),50vw,500px)] right-0 border border-#aaa`;
  const handleInput = async (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const inputValue = target?.value;
    if (!inputValue) setResults([]);
    // Load the pagefind script only once
    // @ts-ignore
    if (!window.pagefind) {
      //@ts-ignore
      window.pagefind = await import("../pagefind/pagefind.js");
    }

    // Search the index using the input value
    // @ts-ignore
    const search = await window.pagefind.search(inputValue);

    // Add the new results
    let res: any[] = [];
    for (const result of search.results) {
      const data = await result.data();
      if (!!data?.meta?.isTranslationsPage) {
        data.url = `/${data.raw_url}`;
      }
      res.push(data);
    }
    // debugger;
    console.log({res});
    setResults(res);
  };
  onCleanup(() => {
    if (typeof window != "undefined") {
      // @ts-ignore
      if (window.pagefind) {
        console.log("Cleaning up pagefind");
        // @ts-ignore
        window.pagefind.destroy();
      }
    }
  });

  return (
    <>
      {/* Input element for search */}

      <div class="relative">
        <input
          class="border border-gray-200 px-2 py-2 rounded-lg bg-white! pis-10 placeholder:(text-#777 font-bold) w-full"
          id="search"
          type="search"
          placeholder={getDict(props.langCode).search}
          value={query()}
          onInput={(e) => setQuery(e.target.value)}
          onKeyUp={handleInput}
          // @ts-ignore chrome only
          onSearch={handleInput}
        />
        <MangifyingGlass class="absolute start-2 top-2" />
      </div>

      {/* Container for search results */}
      <Show when={results()?.length}>
        <ul class={props.isBig ? bigClassNames : mobileClassNames}>
          <For each={results()}>
            {(item) => (
              <li class="border-y-solid border-y-1 border-gray-400 py-4">
                <h3 class="font-bold text-lg cursor-pointer text-[var(--color-accent)]">
                  <a href={item.url}>{item.meta.title}</a>
                </h3>
                <p innerHTML={item.excerpt} />
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
}
