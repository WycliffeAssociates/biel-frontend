import {For, Show, createSignal, onMount} from "solid-js";
import {setSelectedLang} from "./store";
import {createMediaQuery} from "@solid-primitives/media";
import type {translationPageOldEntry} from "@customTypes/types";

type SideBarProps = {
  langs: Record<string, translationPageOldEntry>;
  i18Strings: Record<string, string>;
  languageCode: string;
};
export function SideBar(props: SideBarProps) {
  const isBig = createMediaQuery("(min-width: 768px)", true);
  const [paneIsOpen, setPaneIsOpen] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [subjectType, setSubjectType] = createSignal("all");

  function i18DropdownChoice(val: string) {
    return props.i18Strings[val.toLowerCase()] || val;
  }
  const subjectTypeOptions = Object.values(props.langs).reduce(
    (acc: Set<string>, current) => {
      if (!acc.has("all")) {
        acc.add("all");
      }
      current.contents.forEach((c: any) => {
        const sub = c.subject?.toLowerCase();
        sub && acc.add(sub);
      });
      return acc;
    },
    new Set<string>()
  );
  const shownLangs = () => {
    // debugger;
    if (!searchTerm() && subjectType() == "All") return props.langs;

    let filtered = props.langs;

    if (searchTerm()) {
      filtered = Object.values(props.langs).reduce((acc: any, current) => {
        const matchesEnglish = current.englishName.includes(
          searchTerm().toLowerCase()
        );
        const matchesNative = current.name
          .toLowerCase()
          .includes(searchTerm().toLowerCase());
        if (matchesEnglish || matchesNative) {
          acc[current.code] = current;
        }
        return acc;
      }, {});
    }
    if (subjectType().toLowerCase() !== "all") {
      filtered = Object.values(filtered).reduce((acc: any, current: any) => {
        if (
          current.contents.some((c: {subject?: string}) => {
            return c.subject?.toLowerCase() == subjectType();
          })
        ) {
          acc[current.code] = current;
        }
        return acc;
      }, {});
    }
    return filtered;
  };

  onMount(() => {
    setTimeout(() => {
      // ?lang query params;
      const params = new URLSearchParams(location.search);
      const langQueryParam = params.get("lang");
      const resourceQueryParam = params.get("resource")?.toLowerCase();
      let codeToUse =
        props.languageCode == "es" ? "es-419" : props.languageCode;
      if (props.langs[codeToUse]) {
        setSelectedLang(() => props.langs[codeToUse]);
      }
      if (langQueryParam && !!props.langs[langQueryParam]) {
        const newSelection = props.langs[langQueryParam];
        console.log("setting the new selection due to qp");
        setSelectedLang(() => newSelection);
        // setSelectedLang(props.langs[langQueryParam]);
      }
      if (resourceQueryParam && subjectTypeOptions.has(resourceQueryParam)) {
        setSubjectType(resourceQueryParam);
      }
    }, 10);
  });

  return (
    <div
      class={`absolute z-10 w-full ${isBig() && "static"} ${
        paneIsOpen() ? "bg-white" : ""
      }`}
    >
      <Show when={!isBig()}>
        <button
          class="icon block  w-8 pt-2 !hover:bg-transparent active:bg-none active:text-[#F9A83C] text-black!"
          onClick={() => setPaneIsOpen(!paneIsOpen())}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9 20h13v-4H9zM2 8h5V4H2zm0 6h5v-4H2zm0 6h5v-4H2zm7-6h13v-4H9zm0-6h13V4H9z"
            ></path>
          </svg>
        </button>
      </Show>
      <Show when={isBig() || paneIsOpen()}>
        <div class="w-11/12 mx-auto md:w-full">
          <h2 class="text-2xl font-bold">{props.i18Strings["languages"]}</h2>
          <div class="mbs-4 mbe-4">
            <label>
              <input
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.target.value)}
                type="text"
                style={{
                  border: "1px solid #ccc",
                  display: "block",
                  width: "100%",
                }}
                class="px-2 py-1 border! border-gray-300! block w-full"
                placeholder={props.i18Strings["searchLangs"]}
              />
            </label>
            <select
              class="py-2 px-2 border border-solid border-gray-300 w-full block capitalize"
              value={subjectType()}
              onInput={(e) => {
                setSubjectType(e.target.value);
              }}
            >
              <For each={[...subjectTypeOptions.values()]}>
                {(value) => {
                  return (
                    <option class="capitalize" value={value}>
                      {i18DropdownChoice(value)}
                    </option>
                  );
                }}
              </For>
            </select>
          </div>
          <ul class="w-full max-h-screen overflow-auto">
            <For each={Object.values(shownLangs())}>
              {(lang: any) => {
                return (
                  <li class="">
                    <button
                      class="flex justify-between w-full bg-transparent! text-black! hover:(!bg-[#FAA83D] !text-white) px-2 py-1"
                      onclick={() => {
                        const newSelection = props.langs[lang.code];
                        setSelectedLang(() => newSelection);
                        setSearchTerm("");
                        setPaneIsOpen(false);
                      }}
                    >
                      <span>{lang.englishName}</span>
                      <span class="text-gray-600 text-sm font-italic">
                        {lang.code}
                      </span>
                    </button>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
}
