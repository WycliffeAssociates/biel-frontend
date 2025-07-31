import {MangifyingGlass} from "@components/Icons";
import {Select} from "@kobalte/core/select";
import {constants} from "@lib/constants";
import slugify from "@sindresorhus/slugify";
import type {ResourceTypeToIetfList} from "@src/data/github";
import type {
  GetLanguagesWithContentForBielQueryReturn,
  PubDataLanguage,
  PubDataLanguageWithContentNames,
} from "@src/data/gqlQueries/queries";
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
type OptGroup = {
  value: string;
};
type Category = {
  label: string;
  options: OptGroup[];
};
type ResourceIndexArgs = {
  languages: GetLanguagesWithContentForBielQueryReturn["data"]["language"];
  detailPrefix: string;
  i18nDict: i18nDictType;
  resourceTypeToDisplayName: Record<string, string>;
  resourceTypeArrSearchParams: string[];
  tsFilesByResourceType: ResourceTypeToIetfList;
  tsFileLocalization: Record<string, string>;
};

export function ResourceIndex(props: ResourceIndexArgs) {
  const [searchTerm, setSearchTerm] = createSignal("");
  const filterableKeys = [
    "english_name",
    "ietf_code",
    "national_name",
  ] as const;

  const resourceTypes = Array.from(
    new Set(
      props.languages.flatMap((x) =>
        x.resourceTypesAvailable
          .filter((rType) => !!rType && typeof rType === "string")
          .map((rType) => rType?.toLowerCase())
      )
    )
  ).reduce(
    (acc: Category, curr) => {
      acc.options.push({
        value: curr,
      });
      return acc;
    },
    {
      label: "Resource Types",
      options: [],
    }
  );
  const TSType = Array.from(Object.keys(props.tsFilesByResourceType)).reduce(
    (acc: Category, key) => {
      acc.options.push({
        value: key.toLowerCase(),
      });
      return acc;
    },
    {
      label: "Training Types",
      options: [],
    }
  );

  let resourceTypeToDisplayNameMerged = props.resourceTypeToDisplayName;
  if (props.tsFileLocalization) {
    const withTsFileLocalizations = Object.entries(
      props.tsFileLocalization
    ).reduce((acc: Record<string, string>, [k, v]) => {
      acc[k.toLowerCase()] = v;
      return acc;
    }, {});
    // Record<string,string>
    resourceTypeToDisplayNameMerged = {
      ...props.resourceTypeToDisplayName,
      ...withTsFileLocalizations,
    };
  }
  const allResourceTypes = [resourceTypes, TSType];
  const selectedResourceTypes = allResourceTypes.reduce(
    (acc: OptGroup[], curr) => {
      // for each category, get every option included in query param
      // todo: should also check if sluggified o.value is in query param for R&D
      const matchesQueryParam = curr.options.filter(
        (o) =>
          props.resourceTypeArrSearchParams.includes(o.value) ||
          props.resourceTypeArrSearchParams.includes(slugify(o.value))
      );
      if (matchesQueryParam.length > 0) {
        // for each of those query param options, add those
        matchesQueryParam.forEach((o) => {
          acc.push(o);
        });
      }
      return acc;
    },
    []
  );
  const [filters, setFilter] = createSignal<{
    [key: string]: boolean | string[] | OptGroup[];
    gateway: boolean;
    heart: boolean;
    resourceTypes: OptGroup[];
  }>({
    gateway: true,
    heart: true,
    // resourceTypes: props.resourceTypeArrSearchParams?,
    resourceTypes: selectedResourceTypes,
  });

  const [sortOrder, setSetOrder] = createSignal<validSorts>("NAME_AZ");
  const adjustForCompare = (val: string) =>
    val
      .normalize("NFD")
      .toLowerCase()
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <Not sure now to fix or if is really a problem. >
      .replace(/[\u0300-\u036f]/gu, "");

  const includesSearch = (lang: PubDataLanguage) => {
    // const normalizedValues = R.pipe(m)
    const valuesToCheck = map(
      (key) => adjustForCompare(lang[key]),
      filterableKeys
    );
    return valuesToCheck.some((normalized) =>
      normalized.includes(adjustForCompare(searchTerm()))
    );
  };

  const sortLangs = (langs: PubDataLanguage[]) => {
    const sorters: Record<
      validSorts,
      (a: PubDataLanguage, b: PubDataLanguage) => number
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
  function tsFilesHasResourceType({
    lang,
    rType,
  }: {
    lang: PubDataLanguage;
    rType: string;
  }) {
    // hardcode excpetion;
    const rTypeToUse = rType.includes("-and-")
      ? rType.replace("-and-", "&")
      : rType;
    return (
      props.tsFilesByResourceType[rTypeToUse?.toLowerCase()]?.[
        lang.ietf_code
      ] ||
      props.tsFilesByResourceType[rTypeToUse?.toUpperCase()]?.[lang.ietf_code]
    );
  }

  function filterByResourceTypes(lang: PubDataLanguage) {
    return (
      filters().resourceTypes.length === 0 ||
      filters().resourceTypes.some(
        (optGroup) =>
          lang.resourceTypesAvailable.includes(optGroup.value) ||
          tsFilesHasResourceType({lang, rType: optGroup.value})
      )
    );
  }

  function filterByStatus(lang: PubDataLanguage) {
    const filterFns: Record<
      keyof ReturnType<typeof filters>,
      (lang: PubDataLanguage) => boolean
    > = {
      gateway: (lang: PubDataLanguage) => {
        if (!lang.wa_language_metadata) return true; //default inclusive
        return lang.wa_language_metadata.is_gateway && filters().gateway;
      },
      heart: (lang: PubDataLanguage) => {
        if (!lang.wa_language_metadata) return true; //default inclusive
        return !lang.wa_language_metadata.is_gateway && filters().heart;
      },
    };
    // resource types isn't in this function because if gateway + heart is chosen, all will be true, but we want a disjunction on the resource types
    return Object.values(filterFns).some(
      // onlly apply the filters that are true from ui in filters().
      (fn) => fn(lang)
    );
  }

  const langToShow = () =>
    flow(props.languages, [
      when(() => searchTerm().length >= 2, filter(includesSearch)),
      filter(filterByStatus),
      filter(filterByResourceTypes),
      sortLangs,
    ]) as PubDataLanguageWithContentNames[];
  //
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
            allResourceTypes={allResourceTypes}
            resourceTypeToDisplayName={resourceTypeToDisplayNameMerged}
          />
          <SortDetails
            i18nDict={props.i18nDict}
            setSetOrder={setSetOrder}
            sortOrder={sortOrder}
          />
        </div>
        <div class="w-full md:w-7/10 max-h-70vh min-h-300px overflow-y-auto">
          <Listings
            searchParams={props.resourceTypeArrSearchParams}
            prefix={props.detailPrefix}
            languages={langToShow()}
            tsFilesByResourceType={props.tsFilesByResourceType}
          />
        </div>
      </section>
    </div>
  );
}

type ListingsProps = {
  languages: PubDataLanguageWithContentNames[];
  prefix: string;
  searchParams: string[];
  tsFilesByResourceType: ResourceTypeToIetfList;
};
function Listings(props: ListingsProps) {
  return (
    <ul class="w-full flex flex-col gap-2" data-testid="languageIndexResults">
      <For each={props.languages}>
        {(language) => (
          <Listing
            prefix={props.prefix}
            code={language.ietf_code}
            name={language.national_name}
            anglicized={language.english_name}
            searchParams={props.searchParams}
            langContents={language.contents}
            tsFilesByResourceType={props.tsFilesByResourceType}
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
  langContents: Array<{name: string; resource_type: string}>;
  searchParams: string[];
  tsFilesByResourceType: ResourceTypeToIetfList;
};

type GetLangUrlArgs = {
  prefix: string;
  code: string;
  searchParams: string[];
  langContents: Array<{name: string; resource_type: string}>;
  tsFilesByResourceType: ResourceTypeToIetfList;
};
function getLangUrl({
  prefix,
  code,
  searchParams,
  langContents,
  tsFilesByResourceType,
}: GetLangUrlArgs) {
  const firstSearchParam = searchParams[0];
  const contentMatchingParamType = firstSearchParam
    ? langContents.find(
        (content) =>
          content.resource_type?.toLowerCase() ===
          firstSearchParam?.toLowerCase()
      )
    : null;
  if (contentMatchingParamType) {
    return `/${prefix}/${code}?${
      constants.queryParamResourceType
    }=${encodeURIComponent(contentMatchingParamType.name)}`;
  }

  const paramAccountingEdgeCase = firstSearchParam?.includes("-and-")
    ? firstSearchParam?.replace("-and-", "&")
    : firstSearchParam;
  const contentMatchingDownloadParamType = paramAccountingEdgeCase
    ? tsFilesByResourceType[paramAccountingEdgeCase]?.[code] ||
      tsFilesByResourceType[paramAccountingEdgeCase.toUpperCase()]?.[code]
    : null;

  if (contentMatchingDownloadParamType) {
    return `/${prefix}/${code}?${constants.queryParamsLangContentsDownload}=${contentMatchingDownloadParamType}`;
  }
  return `/${prefix}/${code}`.replaceAll("//", "/");
}
function Listing(props: ListingProps) {
  return (
    <li class="">
      <a
        data-code={props.code}
        data-name={props.name}
        data-anglicized={props.anglicized}
        data-testid="languageIndexResult"
        class="rounded-2xl px-4 py-2 gap-x-4px grid grid-rows-[1fr_1fr] grid-cols-[1fr_1fr] md:(grid grid-cols-[1fr_1fr_1fr] grid-rows-none items-center  w-full justify-between) hover:bg-surface-secondary"
        href={getLangUrl({
          prefix: props.prefix,
          code: props.code,
          searchParams: props.searchParams,
          langContents: props.langContents,
          tsFilesByResourceType: props.tsFilesByResourceType,
        })}
      >
        <ListingName value={props.name} />
        <ListingAnglicized value={props.anglicized} />
        <div class="col-start-2 row-span-full flex flex-col self-center items-end   leading-tight  md:(col-start-auto row-start-0 row-span-1 self-auto flex-row gap-4 justify-end items-center)">
          <ListingCode value={props.code} />
          <ListingArrow />
        </div>
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
  return (
    <span class="col-start-1 row-start-1 md:(col-start-auto row-start-auto) color-onSurface-secondary font-500">
      {props.value}
    </span>
  );
}
function ListingAnglicized(props: ListingUnitProps) {
  return (
    <span class="col-start-1 row-start-2 md:(col-start-auto row-start-auto) text-size-[var(--step--1)] color-onSurface-tertiary">
      {props.value}
    </span>
  );
}
function ListingArrow() {
  return (
    <span class="hidden md:(inline-block  i-ph:arrow-right-bold color-onSurface-tertiary w-1em h-1em)" />
  );
}

function HeaderTitle(props: DictProp) {
  return (
    <h1 class="text-size-[var(--step-1)] md:text-size-[var(--step-2)]">
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
    <div class="relative w-full md:max-w-50ch">
      <MangifyingGlass class="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 mis-1" />
      <input
        type="search"
        class="rounded-xl bg-surface-secondary pis-8 w-full py-2 text-onSurface-tertiary placeholder:text-onSurface-tertiary/80 border-2 border-solid border-surface-border"
        placeholder={props.i18nDict.rl_SearchPlaceholder}
        value={props.searchTerm()}
        onInput={(e) => {
          props.setSearchTerm(e.currentTarget.value);
        }}
        data-testid="languageIndexSearch"
      />
    </div>
  );
}

type FilterProps = {
  filters: Accessor<{
    gateway: boolean;
    heart: boolean;
    resourceTypes: OptGroup[];
  }>;
  setFilters: Setter<{
    gateway: boolean;
    heart: boolean;
    resourceTypes: OptGroup[];
  }>;
  i18nDict: i18nDictType;
  allResourceTypes: Category[];
  resourceTypeToDisplayName: Record<string, string>;
};
function FilterDetails(props: FilterProps) {
  const updateFilters = (values: OptGroup[]) => {
    props.setFilters((prev) => {
      return {
        ...prev,
        resourceTypes: values,
      };
    });
  };

  const displayLabel = (option: OptGroup) => {
    return (
      props.resourceTypeToDisplayName[option?.value] ||
      option?.value?.toUpperCase()
    );
  };
  return (
    <div>
      <p class="text-onSurface-primary font-step-0 font-500">
        {props.i18nDict.rl_TheWordLanguage}
      </p>
      <div class="flex flex-col gap-12">
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

        <div class="">
          <p class="text-onSurface-primary font-step-0 font-500 mbe-4">
            {props.i18nDict.rl_ResourceType}
          </p>
          <Select<OptGroup, Category>
            multiple
            placement="bottom"
            options={props.allResourceTypes}
            optionGroupChildren="options"
            optionValue="value"
            value={props.filters().resourceTypes}
            onChange={(e) => updateFilters(e)}
            placeholder={props.i18nDict.rl_FilterByResourceType}
            sectionComponent={(props) => (
              <Select.Section class="text-onSurface-tertiary uppercase tracking-wide mbs-3 p-1">
                {props.section.rawValue.label}
              </Select.Section>
            )}
            itemComponent={(selectProps) => {
              return (
                <Select.Item
                  item={selectProps.item}
                  data-name="select_item"
                  class="flex items-center justify-between p-2 data-[highlighted]:(bg-surface-secondary outline-none border-none) data-[selected]:(bg-brand-light! text-brand-base font-500)  group"
                >
                  <Select.ItemLabel class="flex gap-2">
                    {props.resourceTypeToDisplayName[
                      selectProps.item.rawValue.value
                    ] || selectProps.item.rawValue.value}

                    <Show
                      when={
                        props.resourceTypeToDisplayName[
                          selectProps.item.rawValue.value
                        ]
                      }
                    >
                      <span class="text-size-[var(--step--1)] text-onSurface-secondary group-data-[highlighted]:(text-inherit)">
                        ({selectProps.item.rawValue.value.toUpperCase()})
                      </span>
                    </Show>
                  </Select.ItemLabel>
                  <Select.ItemIndicator>
                    <span class="i-material-symbols:check-circle w-1.25em h-1.25em" />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            }}
          >
            <Select.Trigger
              aria-label="Fruits"
              as="div"
              data-name="select_trigger"
              class="inline-flex items-center justify-between w-full rounded-lg border bg-surface-secondary text-gray-800 transition-colors duration-200 px-1 "
            >
              <Select.Value<string>
                class="flex items-center gap-2 justify-between p-4 h-20 w-full data-[placeholder-shown]:text-onSurface-secondary"
                data-name="select_value"
              >
                {(state) => (
                  <>
                    <div class="flex items-center gap-2 flex-wrap">
                      <For each={state.selectedOptions().slice(0, 2)}>
                        {(option) => {
                          return (
                            <button
                              type="button"
                              class="bg-surface-primary text-onSurface-secondary rounded-md font-step--1 p-1 flex items-center gap-2 hover:(bg-brand-base text-onSurface-invert)"
                              onClick={() => state.remove(option)}
                            >
                              {/* @ts-ignore types are wrong */}
                              {displayLabel(option)}
                              <span class="i-majesticons:close-circle  w-1em h-1em" />
                            </button>
                          );
                        }}
                      </For>
                      <Show when={state.selectedOptions().length > 2}>
                        <span class="bg-surface-primary text-onSurface-secondary rounded-md font-step--1 p-1 w-3ch grid place-items-center">
                          {state.selectedOptions().slice(2).length}
                        </span>
                      </Show>
                    </div>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={state.clear}
                    >
                      <span class="i-ph:x w-1.5em h-1.5em" />
                    </button>
                  </>
                )}
              </Select.Value>
              <Select.Icon>
                <span class="i-fluent:chevron-up-down-16-filled w-1em h-1em" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                data-name="select_content"
                class="bg-surface-primary overflow-hidden shadow-md rounded-xl origin-[var(--kb-select-content-transform-origin)] animate-[fadeOut_0.2s_ease-in_1] data-[expanded]:animate-[fadeIn_0.2s_ease-out_1]"
              >
                <Select.Listbox
                  class="max-h-280px overflow-y-auto"
                  data-name="slect_listbox"
                />
              </Select.Content>
            </Select.Portal>
          </Select>
        </div>
      </div>
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
      <p class="text-onSurface-primary font-step-0 font-500 mbe-4">
        {props.i18nDict.rl_TheWordSort}
      </p>
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
                    data-testid={`resourceIndex-sort-${sort.cat}`}
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
                        radioSorts().order === "AZ" ? "rotate-0" : "rotate-180"
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
    </div>
  );
}
