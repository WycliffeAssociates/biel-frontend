// Import necessary modules from SolidJS
import {For, Show, createSignal, onCleanup} from "solid-js";
import {getDict} from "@src/i18n/strings.js";

type SearchProps = {
  langCode: string;
};
// Define the Search component
export function Search(props: SearchProps) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<any[]>([]);

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
    // @ts-ignore
    if (typeof window != "undefined") {
      // @ts-ignore
      if (window.pagefind) {
        console.log("Cleaning up pagefind");
        // @ts-ignore
        window.pagefind.destroy();
      }
    }
    /* 
    await pagefind.init();
    */
  });

  return (
    <>
      {/* Input element for search */}
      <input
        style={{
          border: "solid 2px #d1d5db",
          background: "#e5e7eb",
        }}
        class="border-2 !border-gray-300 border-solid rounded p-2 !bg-gray-200 block"
        id="search"
        type="text"
        placeholder={getDict(props.langCode).search}
        value={query()}
        onInput={(e) => setQuery(e.target.value)}
        onKeyUp={handleInput}
      />

      {/* Container for search results */}
      <Show when={results()?.length}>
        <ul class="absolute top-full z-10 bg-white p-2 max-h-500px overflow-auto w-[clamp(200px,50vw,500px)] right-0">
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
