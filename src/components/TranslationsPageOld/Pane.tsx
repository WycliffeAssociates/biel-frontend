import {type Accessor, For, Switch, Match} from "solid-js";
import {selectedLang} from "./store";
import type {Subcontent, translationPageOldEntry} from "@customTypes/types";
// import {i18nStrings} from "./i18n";

type MainPaneProps = {
  initialData: translationPageOldEntry;
  i18Strings: Record<string, string>;
};

export function MainPane(props: MainPaneProps) {
  // const selected = () => {
  //
  //   return selectedLang() ? selectedLang() : props.initialData;
  // };
  // createEffect(() => {
  //
  //   console.log(selectedLang());
  // });

  // const selected = createMemo(() => {
  //   const current = selectedLang();
  //   return current ? current : props.initialData;
  // });
  const selected = () => {
    const current = selectedLang();
    return current ? current : props.initialData;
  };

  // const selected = selectedLang()
  //   ? () => selectedLang() as translationPageOldEntry
  //   : () => ;

  // const val = selected();
  return (
    <div class="w-full">
      <LangTitle selected={selected} />
      <Contents selected={selected} i18Strings={props.i18Strings} />
    </div>
  );
}
type subComponentsProps = {
  selected: Accessor<translationPageOldEntry>;
  i18Strings: Record<string, string>;
};
function LangTitle(props: Omit<subComponentsProps, "i18Strings">) {
  return (
    <h2 class="py-4 px-2 bg-gray-200 font-bold text-4xl">
      {props.selected().name}
    </h2>
  );
}
function Contents(props: subComponentsProps) {
  const hardcodedGWTName = "Greek Words for Translators";

  let hardCodedGlp = {
    code: "wa-glp",
    name: hardcodedGWTName,
    links: [
      {
        url: "https://gwt.bibleineverylanguage.org/",
        zipContent: "",
        quality: "",
        format: "Read on Web",
      },
    ],
    subcontents: [],
    checkingLevel: 0,
  };
  let contentsToUse = () => {
    return props.selected().code == "en"
      ? [...props.selected().contents, hardCodedGlp]
      : props.selected().contents;
  };

  return (
    <div class="flex flex-col gap-4 mt-4 px-4">
      <For each={contentsToUse()}>
        {(content) => {
          return (
            <div class="flex flex-col gap-2">
              <p class="font-700 text-lg flex justify-between items-center">
                {content.name}
                <span class="w-12 icon">
                  <CheckingIcon level={content.checkingLevel} />
                </span>
              </p>
              <div class="flex gap-3 ">
                <For each={content.links}>
                  {(link) => {
                    return (
                      <a
                        href={link.url}
                        style={{
                          color: "white",
                        }}
                        class="bg-[#81A83E] px-2 py-1 text-sm text-white! shadow-xl rounded-md hover:(bg-[#62802f] text-white! scale-99) transition-color transition-250"
                      >
                        {link.format}
                      </a>
                    );
                  }}
                </For>
              </div>
              <div class="">
                <SubContents
                  i18Strings={props.i18Strings}
                  subContents={content.subcontents}
                />
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

function SubContents(props: {
  subContents: Subcontent[];
  i18Strings: Record<string, string>;
}) {
  const groupedByCategoried = props.subContents.reduce(
    (acc: Record<string, (typeof props.subContents)[number][]>, cur) => {
      const category = cur.category.trim();
      if (!category) {
        !!acc["other"] ? acc["other"].push(cur) : (acc["other"] = [cur]);
        return acc;
      }
      if (!acc[category]) {
        acc[category] = [cur];
      } else acc[category]?.push(cur);
      return acc;
    },
    {}
  );

  return (
    <div>
      {
        <For each={Object.entries(groupedByCategoried)}>
          {([key, value]) => {
            return (
              <div>
                <SubcontentAccordion
                  i18nStrings={props.i18Strings}
                  key={key}
                  item={value}
                />
              </div>
            );
          }}
        </For>
      }
    </div>
  );
}
function SubcontentAccordion(props: {
  key: string;
  item: Subcontent[];
  i18nStrings: Record<string, string>;
}) {
  function computeI18nString(val: string) {
    return props.i18nStrings[val.toLowerCase()] || val;
  }

  return (
    <details class="mb-1 cursor-pointer">
      <summary class="bg-gray-200 font-bold px-2 text-lg">
        {computeI18nString(props.key)}
      </summary>
      <ul class="list-unstyled flex flex-col gap-1">
        <For each={props.item}>
          {(subcontentLine) => {
            return <SubContentAccordionLine subContentLine={subcontentLine} />;
          }}
        </For>
      </ul>
    </details>
  );
}

function SubContentAccordionLine(props: {subContentLine: Subcontent}) {
  return (
    <div class="flex justify-between w-full py-2">
      <p>{props.subContentLine.name}</p>
      <ul class="list-unstyled flex gap-2">
        <For each={props.subContentLine.links}>
          {(subLink) => {
            return (
              <li>
                <a
                  class="shadow-2xl  border-2 rounded-md border-[#81A83E] text-[#81A83E] px-2 py-1 text-sm hover:(bg-[#81A83E] text-white)"
                  href={subLink.url}
                >
                  {subLink.format}
                </a>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}

// function dump(arg: any) {
//   return <pre>{JSON.stringify(arg, null, 2)}</pre>;
// }

function CheckingIcon(props: {level: number}) {
  return (
    <Switch fallback={<img src="/images/checking_level_unknown.png" alt="" />}>
      <Match when={props.level == 3}>
        <img src="/images/checking_level_3.png" alt="" />
      </Match>
      <Match when={props.level == 2}>
        <img src="/images/checking_level_2.png" alt="" />
      </Match>
      <Match when={props.level == 1}>
        <img src="/images/checking_level_1.png" alt="" />
      </Match>
    </Switch>
  );
}
