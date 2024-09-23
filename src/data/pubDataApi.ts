import {bibleBookSortOrder} from "@src/utils";
const bielFilter = `show_on_biel: {_eq: true},status: {_eq: "Primary"}`;
import {groupBy} from "ramda";
const hasRenderings = `count: {predicate: {_gt: 0}}`;
import type {
  Cache,
  ExecutionContext,
  Request as WorkerRequest,
  Response as WorkerResponse,
} from "@cloudflare/workers-types";
type getLanguagesWithContentForBielArgs = {
  cache: Cache;
  ctx: ExecutionContext;
  pubDataApiUrl: string;
};
export async function getLanguagesWithContentForBiel({
  cache,
  ctx,
  pubDataApiUrl,
}: getLanguagesWithContentForBielArgs): Promise<{
  data: queryReturn | null;
  wasCached: boolean;
}> {
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
  }
}
`;
  console.log(query);
  const swrThresholdSeconds = 40;
  const oneYearInSeconds = 60 * 60 * 24 * 365;
  try {
    // CF doesn't support SWR yet, but we cna implement it for one route.  Just use caches.default and put one in with a custom x-swr header. When this is called, do a caches.match()... if the max-age or s-max isn't expired, cf should just use that. Then,
    // todo: test all this tomorrow
    let json: any;
    const requestToMake = () => {
      return new Request(pubDataApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query}),
        // no need to set ttl here since cf won't cache post reqest by default, so we don't have to try to bypass the cache;
      });
    };
    const resCacheHeaders = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, max-age=30, s-maxage=${oneYearInSeconds}`,
      "Content-Type": "application/json",
    });

    const {match, revalidate, cacheKey} = await manageCfCachePostReq({
      query,
      url: pubDataApiUrl,
      swrThresholdSeconds,
      cache,
    });
    console.log({didMatch: !!match, revalidate, hasCacheKey: !!cacheKey});
    if (match) {
      if (revalidate) {
        ctx.waitUntil(
          refreshCfCache({
            cache,
            cacheKey,
            newHeaders: resCacheHeaders,
            requestToMake: requestToMake(),
          })
        );
      }
      json = (await match.json()) as queryReturn;
      return {data: json, wasCached: !!match};
    } else {
      const res = await fetch(requestToMake());
      if (res && res.ok) {
        json = (await res.json()) as queryReturn;
        ctx.waitUntil(
          refreshCfCache({
            cache,
            cacheKey,
            newHeaders: resCacheHeaders,
            requestToMake: requestToMake(),
          })
        );
        return {
          data: json,
          wasCached: !!match,
        };
      } else {
        throw new Error("No response");
      }
    }
  } catch (e) {
    console.error(e);
    return {
      data: null,
      wasCached: false,
    };
  }
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

type getLanguageContentsArgs = getLanguagesWithContentForBielArgs & {
  language: string;
};

export async function getLanguageContents({
  cache,
  ctx,
  language,
  pubDataApiUrl,
}: getLanguageContentsArgs) {
  const query = `query LangContents {
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
      title
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

  // Have to write cf specific code for caching post requests. It think we'll skip SWR for this stuff and just set it to an s-maxage of a day.
  let res: Response | WorkerResponse | null | undefined = null;
  const {match, cacheKey} = await manageCfCachePostReq({
    query,
    url: pubDataApiUrl,
    cache,
    // no swr for this route
  });
  // No swr means we just return max if it's cache control header from CF hasn't expired, and otherwise, fetch and stick in cache
  if (match) {
    res = match;
  }
  if (!res) {
    res = await fetch(pubDataApiUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query}),
    });
    if (res.ok && cacheKey) {
      const clone = res.clone();
      const headers = new Headers(clone.headers);
      const oneDayInSeconds = 60 * 60 * 24;
      headers.set(
        "Cache-Control",
        `public, max-age=60, s-maxage=${oneDayInSeconds}`
      );
      // unknown casts for deal with some typescript / cloudflare type shenanigagns. Setting the types globally in tsconfig still doesn't result in no ts errors, and I don't want to abandon lib.dom typings so we're just casting in this file. Cf is mostly spec compliant, but they have a few addiitonal fetaures that I don't need on their request/response
      const response = new Response(clone.body, {
        headers,
      }) as unknown as WorkerResponse;
      ctx.waitUntil(cache.put(cacheKey as unknown as WorkerRequest, response));
    }
  }
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
    data: {
      language: {
        direction: lang.direction,
        isGateway: lang.wa_language_metadata.is_gateway,
        code: lang.ietf_code,
      },
      contents: content,
    },
    wasCached: !!match,
  } as {
    data: langWithContent;
    wasCached: boolean;
  };
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
  title: string | undefined;
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
  title: string | undefined;
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
          title: contents[0]!.title,
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

type manageCfCacheArgs = {
  swrThresholdSeconds?: number;
  query: string;
  url: string;
  cache: Cache;
};

async function manageCfCachePostReq({
  swrThresholdSeconds,
  query,
  url,
  cache,
}: manageCfCacheArgs) {
  // see caching post reqeust here: Basically making a unique cache key based on the url + query
  // https://developers.cloudflare.com/workers/examples/cache-post-request
  const hashedQuery = new TextEncoder().encode(query);
  const hash = await crypto.subtle.digest("SHA-256", hashedQuery);
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  const cacheKeyName = `${url}-${hashHex}`;
  const cacheKey = new Request(cacheKeyName, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });
  const matched = await cache.match(cacheKey as unknown as WorkerRequest);
  if (!matched) {
    return {
      revalidate: true,
      match: matched,
      cacheKey: cacheKey,
    };
  }
  if (!swrThresholdSeconds) {
    return {
      revalidate: false, //Cf's match on max-age or s-max will have determined whther this matched.
      match: matched,
      cacheKey,
    };
  }
  const cacheControlHeader = matched.headers.get("Cache-Control");
  const maxAge = cacheControlHeader?.match(/max-age=(\d+)/)?.[1];
  if (!maxAge) {
    return {
      revalidate: false, //Cf's match on max-age or s-max will have determined whther this matched.
      match: matched,
      cacheKey,
    };
  }
  // const maxAgeSecs = matched.headers.get("max-age");
  const storedDate = matched.headers.get("date");
  const storedSeconds = Date.parse(storedDate || "");
  const now = Date.now();
  const diff = now - storedSeconds;
  const diffSeconds = diff / 1000;
  console.log({maxAge, diffSeconds});
  if (maxAge && diffSeconds < Number(maxAge)) {
    // fresh, don't revalidate.
    return {
      revalidate: false,
      match: matched,
      cacheKey,
    };
  }
  if (
    diffSeconds > Number(maxAge || 0) &&
    diffSeconds < Number(swrThresholdSeconds)
  ) {
    return {
      revalidate: true,
      match: matched,
      cacheKey,
    };
    // Older than max, but less than threshold.  Use the stale, but revalidate
  }
  // older than threshold.  Revalidate with no match
  return {
    revalidate: true,
    match: null,
    cacheKey: cacheKey,
  };
}

type refreshCfCacheArgs = {
  cache: Cache;
  cacheKey: Request;
  newHeaders: Headers;
  requestToMake: Request;
};
async function refreshCfCache({
  cache,
  cacheKey,
  requestToMake,
  newHeaders,
}: refreshCfCacheArgs) {
  try {
    // Get fresh
    const res = await fetch(requestToMake);
    const body = await res.arrayBuffer();
    if (res.ok) {
      await cache.put(
        cacheKey as unknown as WorkerRequest,
        new Response(body, {
          headers: newHeaders,
        }) as unknown as WorkerResponse
      );
    }
  } catch (error) {
    console.error(error);
  }
}
