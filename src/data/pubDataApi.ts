import {bibleBookSortOrder} from "@src/utils";
const bielFilter = `show_on_biel: {_eq: true},status: {_eq: "Primary"}`;
import {groupBy} from "ramda";
const hasRenderings = `count: {predicate: {_gt: 0}}`;
export async function getLanguagesWithContentForBiel() {
  const query = `
query MyQuery {
  language(
    where: {
      contents_aggregate: {
      count: {
      predicate: {_gt: 0},
      filter: {
        wa_content_metadata: {
        ${bielFilter}
        },
        rendered_contents_aggregate: {
        ${hasRenderings}
        }
      }
    }
  }
}
    order_by: {english_name: asc}
  ) {
    english_name
    ietf_code
    national_name
    wa_language_metadata {
      is_gateway
    }
    contents {
      resource_type
      name
      id
      wa_content_metadata {
        show_on_biel
        status
      }
      rendered_contents_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}
`;
  console.log(query);
  // todo env var;  try/catch.
  const url = "https://api.bibleineverylanguage.org/v1/graphql";
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query}),
  });
  const size = res.headers.get("content-length");
  console.log(
    `getLanguagesWithContentForBiel size is ${Number(size) / 1000} kb`
  );
  const json = (await res.json()) as queryReturn;
  return json;
}

export type queryReturn = {
  data: {
    language: queryReturnLanguage[];
  };
};

export type queryReturnLanguage = {
  english_name: string;
  ietf_code: string;
  national_name: string;
  wa_language_metadata: {
    is_gateway: boolean;
  };
  contents: {
    resource_type: string;
    name: string;
    id: string;
    wa_content_metadata: {
      show_on_biel: boolean;
      status: string;
    };
    rendered_contents_aggregate: {
      aggregate: {
        count: number;
      };
    };
  }[];
};

export async function getLanguageContents(language: string) {
  const query2 = `query LangContents {
  language(where: {ietf_code: {_eq: "${language}"}}) {
    national_name
    direction
    ietf_code
    wa_language_metadata {
      is_gateway
    }
    contents(
      where: {wa_content_metadata: {status: {_eq: "Primary"}, show_on_biel: {_eq: true}}, rendered_contents_aggregate: {count: {predicate: {_gt: 0}}}}
    ) {
      name
      type
      domain
      resource_type
      gitRepo:git_repo {
      url:repo_url
    }
      rendered_contents {
        hash
        url
        scriptural_rendering_metadata {
          chapter
          book_slug
          book_name
        }
        file_type
        file_size_bytes
      }
    }
  }
}
  `;
  console.log(query2);
  const url = "https://api.bibleineverylanguage.org/v1/graphql";
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query: query2}),
  });
  const size = res.headers.get("content-length");
  console.log(`getLanguageContents size is ${Number(size) / 1000} kb`);
  const json = (await res.json()) as langContentReturn;
  let lang = json.data.language[0];
  if (!lang) {
    throw new Error(`no language found for ${language}`);
  }
  if (!lang.wa_language_metadata.is_gateway) {
    //
    lang.contents = collateGatewayContent({
      contents: lang.contents,
      langName: lang.national_name,
    });
  }
  lang.contents.sort((a, b) => {
    const domainOrder = ["scripture", "gloss", "parascriptural", "peripheral"];
    const aIndex = domainOrder.indexOf(a.domain);
    const bIndex = domainOrder.indexOf(b.domain);
    return aIndex - bIndex;
  });
  // todo: if we just make this SSR, what's the best s-max or way to cache this call?

  // todo: if the language gateway is false, for scripture domain, reduce where resource_type is same.  The name of that should be Language Name + resource Type; So
  // reduce on resource type: Each type, create a new "content" of name + type, then
  const content = lang.contents.map((content) => {
    // if (content.domain != "peripheral") {
    // {wholeChapterUrls byKey[], chapters: [], wholeResourceUrl: string}
    const reduced = shapeRenderedContentsByType(content.rendered_contents);

    sortHtmlChaptersCanonically(reduced.htmlChapters);

    return {
      ...content,
      rendered_contents: reduced,
    };
  });
  return {
    language: {
      direction: lang.direction,
      isGateway: lang.wa_language_metadata.is_gateway,
      code: lang.ietf_code,
    },
    contents: content,
  } as langWithContent;
}

type RenderedContentRowsByType = {
  wholeChapterUrls: {[key: string]: RenderedContentRow};
  htmlChapters: RenderedContentRow[];
  wholeResourceRow: RenderedContentRow | null;
  usfmSources: RenderedContentRow[];
  otherFiles: RenderedContentRow[];
};

type ContentRow = {
  name: string;
  type: string;
  domain: string;
  resource_type: string;
  gitRepo?: {
    url: string;
  };
  // usfmSources?: string[];
  rendered_contents: RenderedContentRow[];
};
type langContentReturn = {
  data: {
    language: {
      national_name: string;
      direction: "ltr" | "rtl";
      ietf_code: string;
      // # english_name
      wa_language_metadata: {
        is_gateway: boolean;
      };
      contents: ContentRow[];
    }[];
  };
};
export type RenderedContentRow = {
  hash: string;
  url: string;
  scriptural_rendering_metadata: {
    chapter: string;
    book_slug: string;
    book_name: string;
  };
  file_type: string;
  file_size_bytes: number;
};

type contentCommon = {
  name: string;
  type: string;
  resource_type: string;
  gitRepo?: {
    url: string;
  };
  rendered_contents: RenderedContentRowsByType;
};
export type domainScripture = contentCommon & {
  domain: "scripture" | "gloss" | "parascriptural";
};
export type domainPeripheral = contentCommon & {
  domain: "peripheral";
  // rendered_contents: RenderedContentRow[];
};

export type contentsForLang = domainScripture | domainPeripheral;

export type languageForClient = {
  direction: "ltr" | "rtl";
  isGateway: boolean;
  code: string;
};
export type langWithContent = {
  language: languageForClient;
  contents: contentsForLang[];
};

// todo: swap query for this one, and see if I can join on heart, same name, or same resource type
/*
  query MyQuery {
    language(where:{ietf_code:{_eq:"fr"}}) {
      national_name
      direction
      wa_language_metadata {
        is_gateway
      }
      contents(
        where:{wa_content_metadata: {status: {_eq: "Primary"}, show_on_biel: {_eq: true}}, rendered_contents_aggregate: {count: {predicate: {_gt: 0}}}}
      ) {
        name
      }
    }
}
*/
function collateGatewayContent({
  contents,
  langName,
}: {
  contents: ContentRow[];
  langName: string;
}) {
  const byDomain = groupBy(
    (content: ContentRow) =>
      `${content.domain}-${content.resource_type}-${content.type}`,
    contents
  );
  const contentReduced = Object.entries(byDomain)
    .map(([key, value]) => {
      if (
        ["scripture", "gloss", "parascriptural"].some(
          (bookChapVerseSchemaType) => key.includes(bookChapVerseSchemaType)
        )
      ) {
        // single vlaue to merge into
        const content: (typeof contents)[number] = {
          domain: contents[0]!.domain,
          type: contents[0]!.type,
          resource_type: contents[0]!.resource_type,
          name: `${langName} ${contents[0]!.resource_type}`,
          // usfmSources: contents.map((c) => c.gitRepo?.url),
          rendered_contents: [],
        };
        if (value) {
          // mergin all of same type into the rendered_content
          value.forEach((contentRow) => {
            content.rendered_contents.push(...contentRow.rendered_contents);
          });
        }
        return content;
        // merge in each values rendered contents:
      } else return value;
    })
    .filter((x) => !!x)
    .flat();
  return contentReduced;
}

function shapeRenderedContentsByType(rows: RenderedContentRow[]) {
  const emptyAcc: RenderedContentRowsByType = {
    wholeChapterUrls: {},
    htmlChapters: [],
    wholeResourceRow: null,
    usfmSources: [],
    otherFiles: [],
  };
  return rows.reduce((acc, row) => {
    if (row.url.includes("whole.json")) {
      acc.wholeChapterUrls[row.scriptural_rendering_metadata.book_slug] = row;
    } else if (row.url.includes("download.json")) {
      acc.wholeResourceRow = row;
    } else if (row.url.includes(".json") || row.url.includes("print_all")) {
      acc.otherFiles.push(row);
    } else if (row.url.includes("source.usfm")) {
      acc.usfmSources.push(row);
    } else if (row.url.includes(".html")) {
      acc.htmlChapters.push(row);
    }
    return acc;
  }, emptyAcc);
}
function sortHtmlChaptersCanonically(htmlChapters: RenderedContentRow[]) {
  htmlChapters?.sort((a, b) => {
    const aBookSlug = a.scriptural_rendering_metadata?.book_slug;
    const bBookSlug = b.scriptural_rendering_metadata?.book_slug;
    if (!aBookSlug) {
      console.log(`missing bookSlug in htmlChapters: ${a.url}`);
    }
    if (!bBookSlug) {
      console.log(`missing bookSlug in htmlChapters: ${b.url}`);
    }
    if (!aBookSlug || !bBookSlug) {
      return 0;
    }
    const bookSortOrder = bibleBookSortOrder;
    const aBookOrder = bookSortOrder[aBookSlug] || Infinity;
    const bBookOrder = bookSortOrder[bBookSlug] || Infinity;
    const bookCompare = aBookOrder - bBookOrder;
    let chapterCompare = 0;
    if (bookCompare === 0) {
      chapterCompare =
        Number(a.scriptural_rendering_metadata.chapter) -
        Number(b.scriptural_rendering_metadata.chapter);
    }
    return bookCompare || chapterCompare;
  });
  htmlChapters?.forEach((c) => {
    if (
      !c.scriptural_rendering_metadata?.chapter &&
      c.url.includes("front.html")
    ) {
      c.scriptural_rendering_metadata.chapter = "front";
    }
  });
}
