import {MangifyingGlass} from "@components/Icons";
import type {queryReturn, queryReturnLanguage} from "@src/data/pubDataApi";
import type {i18nDictType} from "@src/i18n/strings";
import {filter, flow, map, sort, when} from "ramda";
import {type Accessor, For, type Setter, Show, createSignal} from "solid-js";

type validSorts =
  | "CODE_AZ"
  | "CODE_ZA"
  | "NAME_AZ"
  | "NAME_ZA"
  | "ANGLICIZED_AZ"
  | "ANGLICIZED_ZA";
type ResourceIndexArgs = {
  languages: queryReturn["data"]["language"];
  detailPrefix: string;
  i18nDict: i18nDictType;
};

export function ResourceIndex(props: ResourceIndexArgs) {
  const [searchTerm, setSearchTerm] = createSignal("");
  const filterableKeys = [
    "english_name",
    "ietf_code",
    "national_name",
  ] as const;
  const [filters, setFilter] = createSignal<{
    [key: string]: boolean;
    gateway: boolean;
    heart: boolean;
  }>({
    gateway: true,
    heart: true,
  });

  const [sortOrder, setSetOrder] = createSignal<validSorts>("NAME_AZ");
  const adjustForCompare = (val: string) =>
    // todo: biome-ignore lint/suspicious/noMisleadingCharacterClass: <Not sure how to fix this today>
    val
      .normalize("NFD")
      .toLowerCase()
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <Not sure now to fix or if is really a problem. >
      .replace(/[\u0300-\u036f]/gu, "");

  const includesSearch = (lang: queryReturnLanguage) => {
    // const normalizedValues = R.pipe(m)
    const valuesToCheck = map(
      (key) => adjustForCompare(lang[key]),
      filterableKeys
    );
    return valuesToCheck.some((normalized) =>
      normalized.includes(adjustForCompare(searchTerm()))
    );
  };

  const sortLangs = (langs: queryReturnLanguage[]) => {
    const sorters: Record<
      validSorts,
      (a: queryReturnLanguage, b: queryReturnLanguage) => number
    > = {
      NAME_AZ: (a, b) => a.national_name.localeCompare(b.national_name),
      NAME_ZA: (a, b) => b.national_name.localeCompare(a.national_name),
      CODE_AZ: (a, b) => a.ietf_code.localeCompare(b.ietf_code),
      CODE_ZA: (a, b) => b.ietf_code.localeCompare(a.ietf_code),
      ANGLICIZED_AZ: (a, b) => a.english_name.localeCompare(b.english_name),
      ANGLICIZED_ZA: (a, b) => b.english_name.localeCompare(a.english_name),
    };
    return sort(sorters[sortOrder()], langs);
  };
  function filterByStatus(lang: queryReturnLanguage) {
    if (Object.values(filters()).every((v) => v === true)) {
      return true;
    }
    const filterFns: Record<
      keyof ReturnType<typeof filters>,
      (lang: queryReturnLanguage) => boolean
    > = {
      gateway: (lang: queryReturnLanguage) => {
        if (!lang.wa_language_metadata) return true; //default inclusive
        return lang.wa_language_metadata.is_gateway;
      },
      heart: (lang: queryReturnLanguage) => {
        if (!lang.wa_language_metadata) return true; //default inclusive
        return !lang.wa_language_metadata.is_gateway;
      },
    };
    return Object.entries(filterFns).some(
      // onlly apply the filters that are true from ui in filters().
      ([k, fn]) => filters()[k] === true && fn(lang)
    );
  }

  const langToShow = () =>
    flow(props.languages, [
      when(() => searchTerm().length >= 2, filter(includesSearch)),
      filter(filterByStatus),
      sortLangs,
    ]);

  return (
    <div class="contain py-8">
      <div class="flex flex-col gap-8 pbe-4 md:(flex-row justify-between w-full items-center) ">
        <HeaderTitle i18nDict={props.i18nDict} />
        <HeaderSearch
          i18nDict={props.i18nDict}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </div>
      <section class="flex gap-16 min-h-70vh">
        <div class="hidden md:(w-3/10 flex flex-col gap-8)">
          <FilterDetails
            i18nDict={props.i18nDict}
            filters={filters}
            setFilters={setFilter}
          />
          <SortDetails
            i18nDict={props.i18nDict}
            setSetOrder={setSetOrder}
            sortOrder={sortOrder}
          />
        </div>
        <div class="w-full md:w-7/10 max-h-70vh min-h-300px overflow-y-auto">
          <Listings prefix={props.detailPrefix} languages={langToShow()} />
        </div>
      </section>
    </div>
  );
}

type ListingsProps = {
  languages: queryReturn["data"]["language"];
  prefix: string;
};
function Listings(props: ListingsProps) {
  return (
    <ul class="w-full flex flex-col gap-2">
      <For each={props.languages}>
        {(language) => (
          <Listing
            prefix={props.prefix}
            code={language.ietf_code}
            name={language.national_name}
            anglicized={language.english_name}
          />
        )}
      </For>
    </ul>
  );
}

type ListingProps = {
  code: string;
  name: string;
  anglicized: string;
  prefix: string;
};
function Listing(props: ListingProps) {
  return (
    <li class="">
      <a
        class="flex flex-row-reverse gap-4 md:(grid grid-cols-[1fr_4fr_2fr] w-full justify-between) hover:bg-brand-light"
        href={`${props.prefix}/${props.code}`}
      >
        <ListingCode value={props.code} />
        <div class="flex flex-col leading-tight w-full md:(flex-row justify-between)">
          <ListingName value={props.name} />
          <ListingAnglicized value={props.anglicized} />
        </div>
        <ListingArrow />
      </a>
    </li>
  );
}

type ListingUnitProps = {
  value: string;
};
type DictProp = {
  i18nDict: i18nDictType;
};
function ListingCode(props: ListingUnitProps) {
  return <span class="color-onSurface-tertiary shrink-0">{props.value}</span>;
}
function ListingName(props: ListingUnitProps) {
  return <span class="color-onSurface-secondary">{props.value}</span>;
}
function ListingAnglicized(props: ListingUnitProps) {
  return (
    <span class="text-size-[var(--step--1)] color-onSurface-tertiary">
      {props.value}
    </span>
  );
}
function ListingArrow() {
  return (
    <span class="hidden md:(inline-block mis-auto i-ph:arrow-right-bold color-onSurface-tertiary w-1em h-1em)" />
  );
}

function HeaderTitle(props: DictProp) {
  // todo: localize?
  return (
    <h1 class="text-size-[var(--step-3)]">
      {props.i18nDict.rl_ChooseALanguage}
    </h1>
  );
}
type HeaderSearchProps = {
  searchTerm: Accessor<string>;
  setSearchTerm: Setter<string>;
  i18nDict: i18nDictType;
};
function HeaderSearch(props: HeaderSearchProps) {
  return (
    <div class="relative w-full max-w-50ch">
      <MangifyingGlass class="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 mis-1" />
      <input
        type="search"
        class="rounded-xl bg-surface-secondary pis-8 w-full py-2 text-onSurface-tertiary placeholder:text-onSurface-tertiary/80"
        placeholder={props.i18nDict.rl_SearchPlaceholder}
        value={props.searchTerm()}
        onInput={(e) => {
          props.setSearchTerm(e.currentTarget.value);
        }}
      />
    </div>
  );
}

type FilterProps = {
  filters: Accessor<{
    gateway: boolean;
    heart: boolean;
  }>;
  setFilters: Setter<{
    gateway: boolean;
    heart: boolean;
  }>;
  i18nDict: i18nDictType;
};
function FilterDetails(props: FilterProps) {
  return (
    <div>
      <details open class="group">
        <summary class="cursor-pointer  webkit-hide-summary-arrow list-none ">
          <p class="flex rtl:flex-row-reverse justify-between">
            <span class="inline-flex gap-2">
              <span class="i-material-symbols:filter-alt-outline w-1.5em h-1.5em" />
              <span class="font-bold text-size-[var(--step-0)]">
                {" "}
                {props.i18nDict.rl_Filter}{" "}
              </span>
            </span>
            <span class="i-ic:round-chevron-left w-1.5em h-1.5em rotate-90 group-open:-rotate-90 transition-transform duration-150 " />
          </p>
        </summary>
        <div class="flex flex-col gap-4">
          <label class="mbs-4 flex gap-2  text-brand-base accent-[hsla(var(--clr-brand-base))] font-bold">
            <input
              type="checkbox"
              checked={props.filters().gateway}
              onChange={(e) =>
                props.setFilters((prev) => ({
                  ...prev,
                  gateway: e.currentTarget.checked,
                }))
              }
            />
            {props.i18nDict.rl_GatewayLanguage}
          </label>
          <label class="flex gap-2  text-brand-base accent-[hsla(var(--clr-brand-base))] font-bold">
            <input
              type="checkbox"
              checked={props.filters().heart}
              onChange={(e) =>
                props.setFilters((prev) => ({
                  ...prev,
                  heart: e.currentTarget.checked,
                }))
              }
            />
            {props.i18nDict.rl_HeartLanguage}
          </label>
        </div>
      </details>
    </div>
  );
}

type SortProps = {
  sortOrder: Accessor<validSorts>;
  setSetOrder: Setter<validSorts>;
  i18nDict: i18nDictType;
};
function SortDetails(props: SortProps) {
  const [radioSorts, setRadioSorts] = createSignal({
    category: "NAME",
    order: "AZ",
  });
  function setRadio({
    category,
    direction,
  }: {
    category: string;
    direction: string;
  }) {
    const cat = category ? category : radioSorts().category;
    const dir = direction ? direction : radioSorts().order;
    setRadioSorts({category: cat, order: dir});
    const joined = `${cat}_${dir}` as validSorts;
    props.setSetOrder(joined);
  }
  const sortLabels = [
    {
      cat: "CODE",
      label: props.i18nDict.rl_IeftCode,
    },
    {
      cat: "NAME",
      label: props.i18nDict.rl_LangName,
    },
    {
      cat: "ANGLICIZED",
      label: props.i18nDict.rl_Anglicized,
    },
  ];
  return (
    <div class="w-full">
      <details class="group" open>
        <summary class="cursor-pointer  webkit-hide-summary-arrow list-none pb-4">
          <p class="flex rtl:flex-row-reverse justify-between">
            <span class="inline-flex gap-2">
              <span class="i-material-symbols:sort-rounded w-1.5em h-1.5em" />
              <span class="font-bold text-size-[var(--step-0)]">
                {props.i18nDict.rl_Sort}{" "}
              </span>
            </span>
            <span class="i-ic:round-chevron-left w-1.5em h-1.5em rotate-90 group-open:-rotate-90 transition-transform duration-150 " />
          </p>
        </summary>
        <ul class="grid auto-rows-[1fr]">
          <For each={sortLabels}>
            {(sort) => (
              <li class="flex items-center ">
                <div class="w-full flex justify-between items-center">
                  <label class="flex gap-2">
                    <input
                      type="radio"
                      checked={radioSorts().category === sort.cat}
                      name="sort"
                      class=""
                      onChange={() => {
                        const current = radioSorts();
                        setRadio({
                          direction: current.order,
                          category: sort.cat,
                        });
                      }}
                    />

                    {sort.label}
                  </label>
                  <Show when={radioSorts().category === sort.cat}>
                    <button
                      type="button"
                      data-sort={radioSorts().category}
                      class="bg-surface-secondary flex rtl:flex-row-reverse rounded-lg px-2 py-1 border border-solid border-surface-border"
                      onClick={() => {
                        const current = radioSorts();
                        const newOrder = current.order === "AZ" ? "ZA" : "AZ";
                        setRadio({category: sort.cat, direction: newOrder});
                      }}
                    >
                      <span
                        class={`inline-block transition-transform px-1   ${
                          radioSorts().order === "AZ"
                            ? "rotate-0"
                            : "rotate-180"
                        }`}
                      >
                        <span
                          class={"i-ic:baseline-arrow-downward w-1em h-1em "}
                        />
                      </span>
                      <span>
                        {radioSorts().order === "AZ"
                          ? props.i18nDict.rl_A_Z
                          : props.i18nDict.rl_Z_A}
                      </span>
                    </button>
                  </Show>
                </div>
              </li>
            )}
          </For>
        </ul>
      </details>
    </div>
  );
}
