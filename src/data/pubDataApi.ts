import {bibleBookSortOrder} from "@src/utils";
import {
  type ContentRow,
  type GetLanguageContentsQueryReturn,
  type GetLanguagesWithContentForBielQueryReturn,
  type LangWithContent,
  type RenderedContentRow,
  type RenderedContentRowsByType,
  getLangWithContentNamesQuery,
  type getLangWithContentNamesQueryReturn,
  getLanguageContentsQuery,
  getLanguagesWithContentForBielQuery,
} from "./gqlQueries/queries";
type;

import {groupBy, type} from "ramda";

import type {
  Cache,
  ExecutionContext,
  Request as WorkerRequest,
  Response as WorkerResponse,
} from "@cloudflare/workers-types";
import {CacheTags} from "@lib/constants";
type getLanguagesWithContentForBielArgs = {
  cache: Cache;
  ctx: ExecutionContext;
  pubDataApiUrl: string;
  doBustCache: boolean;
  siteLanguage: string;
};
export async function getLanguagesWithContentForBiel({
  cache,
  ctx,
  pubDataApiUrl,
  doBustCache,
  siteLanguage,
}: getLanguagesWithContentForBielArgs): Promise<{
  data: GetLanguagesWithContentForBielQueryReturn | null;
  wasCached: boolean;
  resourceTypeToDisplayName: Record<string, string>;
}> {
  const siteLanguageException = siteLanguage === "es" ? "es-419" : siteLanguage;

  // todo: decide on a valid stale seconds time
  const swrThresholdSeconds = 3600; //valid for another hour after max
  const maxAgeValidSecond = 60 * 60 * 3; // 3 hours
  const oneYearInSeconds = 60 * 60 * 24 * 365;
  try {
    // CF doesn't support SWR yet, but we cna implement it for one route.  Just use caches.default and put one in with a custom x-swr header. When this is called, do a caches.match()... if the max-age or s-max isn't expired, cf should just use that. Then,
    let json: GetLanguagesWithContentForBielQueryReturn;
    const query = getLanguagesWithContentForBielQuery(siteLanguageException);
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
      "Cache-Control": `public, max-age=${maxAgeValidSecond}, s-maxage=${oneYearInSeconds}`,
      "Content-Type": "application/json",
      "Cache-Tag": CacheTags.languagesListing,
    });

    // skips cache matching if there is a query parameter to explicitly bust and update shared cache
    const {match, revalidate, cacheKey} = await manageCfCachePostReq({
      query,
      url: pubDataApiUrl,
      swrThresholdSeconds,
      cache,
      isCacheBustRequest: doBustCache,
    });
    if (match) {
      console.log(
        `Cache hit for ${pubDataApiUrl} languages; revalidate: ${revalidate}, `
      );
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
      json = (await match.json()) as GetLanguagesWithContentForBielQueryReturn;
      const resourceTypeToDisplayName = json.data.localization.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.resourceTypeKey] = curr.value;
          return acc;
        },
        {}
      );
      json.data.language.forEach((l) => {
        l.resourceTypesAvailable = l.contents.map((c) => c.resource_type);
      });

      return {data: json, wasCached: !!match, resourceTypeToDisplayName};
    }

    const res = await fetch(requestToMake());
    if (res?.ok) {
      json = (await res.json()) as GetLanguagesWithContentForBielQueryReturn;
      json.data.language.forEach((l) => {
        l.resourceTypesAvailable = l.contents.map((c) => c.resource_type);
      });
      ctx.waitUntil(
        refreshCfCache({
          cache,
          cacheKey,
          newHeaders: resCacheHeaders,
          requestToMake: requestToMake(),
        })
      );
      const resourceTypeToDisplayName = json.data.localization.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.resourceTypeKey] = curr.value;
          return acc;
        },
        {}
      );
      return {
        data: json,
        wasCached: !!match,
        resourceTypeToDisplayName,
      };
    }
    throw new Error("No response");
  } catch (e) {
    console.error(e);
    return {
      data: null,
      wasCached: false,
      resourceTypeToDisplayName: {},
    };
  }
}

type getLanguageContentsArgs = getLanguagesWithContentForBielArgs & {
  language: string;
};

export async function getLanguageContents({
  cache,
  ctx,
  language,
  pubDataApiUrl,
  doBustCache,
  siteLanguage,
}: getLanguageContentsArgs) {
  const siteLanguageException = siteLanguage === "es" ? "es-419" : siteLanguage;
  const query = getLanguageContentsQuery({
    lang: language,
    siteLang: siteLanguageException,
  });

  // Have to write cf specific code for caching post requests. It think we'll skip SWR for this stuff and just set it to an s-maxage of a day.
  let res: Response | WorkerResponse | null | undefined = null;
  const {match, cacheKey} = await manageCfCachePostReq({
    query,
    url: pubDataApiUrl,
    cache,
    isCacheBustRequest: doBustCache,
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
  const json = (await res.json()) as GetLanguageContentsQueryReturn;

  const resourceTypeToDisplayName = json.data.localization.reduce(
    (acc: Map<string, string>, curr) => {
      return acc.set(curr.resourceTypeKey, curr.value);
    },
    new Map()
  );

  const lang = json.data.language[0];
  if (!lang) {
    throw new Error(`no language found for ${language}`);
  }
  if (
    doCollateContent({
      ietf: lang.ietf_code,
      isGateway: lang.wa_language_metadata?.is_gateway,
    })
  ) {
    lang.contents = collateGatewayContent({
      contents: lang.contents,
      langName: lang.national_name,
    });
  }
  lang.contents.sort((a, b) => {
    const domainOrder = ["scripture", "gloss", "parascriptural", "peripheral"];
    const aIndex = domainOrder.indexOf(a.domain);
    const bIndex = domainOrder.indexOf(b.domain);

    if (a.resource_type === "udb") {
      return 1;
    }
    if (b.resource_type === "udb") {
      return -1;
    }
    return aIndex - bIndex;
  });

  // reduce on resource type: Each type, create a new "content" of name + type, then
  const content = lang.contents.map((content) => {
    // if (content.domain != "peripheral") {
    // {wholeChapterUrls byKey[], chapters: [], wholeResourceUrl: string}
    const reduced = shapeRenderedContentsByType(content.rendered_contents);

    sortHtmlChaptersCanonically(reduced.htmlChapters);
    const getDisplayName = () => {
      let base = "";
      const typeMap = resourceTypeToDisplayName.get(content.resource_type);
      if (!lang.wa_language_metadata?.is_gateway) {
        base += `${lang.national_name}`;
        if (typeMap) {
          base += ` ${typeMap}`;
        }
      } else if (typeMap) {
        base = typeMap;
      } else {
        base = `${lang.national_name} ${content.resource_type}`;
      }
      return base;
    };
    return {
      ...content,
      displayName: getDisplayName(),
      rendered_contents: reduced,
    };
  });
  return {
    data: {
      language: {
        direction: lang.direction,
        isGateway: lang.wa_language_metadata?.is_gateway,
        code: lang.ietf_code,
        englishName: lang.english_name,
        national_name: lang.national_name,
      },
      contents: content,
    },
    wasCached: !!match,
  } as {
    data: LangWithContent;
    wasCached: boolean;
  };
}

export async function getLangsWithContentNames({
  pubDataUrl,
}: {
  pubDataUrl: string;
}) {
  const query = getLangWithContentNamesQuery();

  const res = await fetch(pubDataUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query}),
  });
  const json = (await res.json()) as getLangWithContentNamesQueryReturn;
  const resourceTypeToDisplayName = json.data.localization.reduce(
    (acc: Map<string, string>, curr) => {
      return acc.set(`${curr.ietf_code}-${curr.resourceTypeKey}`, curr.value);
    },
    new Map()
  );
  json.data.language.forEach((lang) => {
    if (
      doCollateContent({
        ietf: lang.ietf_code,
        isGateway: lang.wa_language_metadata?.is_gateway,
      })
    ) {
      // @ts-ignore: I know that collateGatewayContent isn't going to set a displayName: I'm doing that below for all languages regardless of is gateway status
      lang.contents = collateGatewayContent({
        contents: lang.contents,
        langName: lang.national_name,
      });
    }
    lang.contents.forEach((c) => {
      c.displayName =
        resourceTypeToDisplayName.get(`${lang.ietf_code}-${c.resource_type}`) ||
        c.title ||
        `${lang.national_name} ${c.resource_type}`;
    });
  });
  return json;
}

type ManageCfCacheArgs = {
  swrThresholdSeconds?: number;
  query: string;
  url: string;
  cache: Cache;
  isCacheBustRequest?: boolean;
};

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
          domain: byDomain[key]![0]!.domain,
          title: byDomain[key]![0]!.title,
          type: byDomain[key]![0]!.type,
          resource_type: byDomain[key]![0]!.resource_type,
          name: `${langName} ${byDomain[key]![0]!.resource_type}`,
          // usfmSources: contents.map((c) => c.gitRepo?.url),
          rendered_contents: [],
        };
        if (value) {
          // mergin all of same type into the rendered_content
          value.forEach((contentRow) => {
            if (contentRow?.rendered_contents) {
              content.rendered_contents.push(...contentRow.rendered_contents);
            }
          });
        }
        return content;
        // merge in each values rendered contents:
      }
      return value;
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
    if (
      row.url.includes("whole.json") &&
      row.scriptural_rendering_metadata?.book_slug
    ) {
      acc.wholeChapterUrls[row.scriptural_rendering_metadata.book_slug] = row;
    } else if (row.url.includes("download.json")) {
      acc.wholeResourceRow = row;
    } else if (row.url.includes(".json") || row.url.includes("print_all")) {
      acc.otherFiles.push(row);
    } else if (row.url.includes("source.usfm")) {
      acc.usfmSources.push(row);
    } else if (
      row.url.includes(".html") &&
      !row.scriptural_rendering_metadata?.chapter &&
      !row.scriptural_rendering_metadata?.book_slug &&
      !row.scriptural_rendering_metadata?.book_name
    ) {
      acc.otherFiles.push(row);
    } else if (row.url.includes(".html")) {
      acc.htmlChapters.push(row);
    }
    return acc;
  }, emptyAcc);
}
function sortHtmlChaptersCanonically(htmlChapters: RenderedContentRow[]) {
  htmlChapters?.sort((a, b) => {
    const aBookSlug = a.scriptural_rendering_metadata?.book_slug?.toUpperCase();
    const bBookSlug = b.scriptural_rendering_metadata?.book_slug?.toUpperCase();
    if (!aBookSlug || !bBookSlug) {
      return 0;
    }
    const bookSortOrder = bibleBookSortOrder;
    const aBookOrder = bookSortOrder[aBookSlug] || Number.POSITIVE_INFINITY;
    const bBookOrder = bookSortOrder[bBookSlug] || Number.POSITIVE_INFINITY;
    const bookCompare = aBookOrder - bBookOrder;
    let chapterCompare = 0;
    if (bookCompare === 0) {
      chapterCompare =
        Number(a.scriptural_rendering_metadata?.chapter) -
        Number(b.scriptural_rendering_metadata?.chapter);
    }
    return bookCompare || chapterCompare;
  });
  htmlChapters?.forEach((c) => {
    //  Special cases for frontmatter.
    // todo: would be nice to localize though
    if (
      c.scriptural_rendering_metadata &&
      !c.scriptural_rendering_metadata?.chapter &&
      c.url.includes("front.html")
    ) {
      c.scriptural_rendering_metadata.chapter = "front";
    }
    if (
      c.scriptural_rendering_metadata &&
      !c.scriptural_rendering_metadata?.chapter &&
      c.url.includes("intro.html")
    ) {
      c.scriptural_rendering_metadata.chapter = "intro";
    }
  });
}

async function manageCfCachePostReq({
  swrThresholdSeconds,
  query,
  url,
  cache,
  isCacheBustRequest = false,
}: ManageCfCacheArgs) {
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
  if (isCacheBustRequest) {
    return {
      revalidate: true,
      match: null,
      cacheKey: cacheKey,
    };
  }
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
    console.log(
      `matched ${url} but no max-age found on cache-control ${cacheControlHeader}, so revalidating`
    );
    return {
      revalidate: true, //Cf's match on max-age or s-max will have determined whther this matched.
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
  if (maxAge && diffSeconds < Number(maxAge)) {
    // fresh, don't revalidate.
    console.log(
      `matched ${url} with max-age ${maxAge} and diff ${diffSeconds} and swr of ${swrThresholdSeconds}, so not revalidating`
    );
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
    console.log(
      `matched ${url} with max-age ${maxAge} and diff ${diffSeconds} and swr of ${swrThresholdSeconds}, so revalidating`
    );
    return {
      revalidate: true,
      match: matched,
      cacheKey,
    };
    // Older than max, but less than threshold.  Use the stale, but revalidate
  }
  // older than threshold.  Revalidate with no match
  console.log(
    `match for ${url} expired swr threshold ${swrThresholdSeconds}, so revalidating`
  );
  return {
    revalidate: true,
    match: null,
    cacheKey: cacheKey,
  };
}

type RefreshCfCacheArgs = {
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
}: RefreshCfCacheArgs) {
  try {
    // Get fresh
    console.log(`Fetching ${requestToMake.url} with cacheKey ${cacheKey.url}`);
    const res = await fetch(requestToMake);
    const body = await res.arrayBuffer();
    const is200 = res.status === 200;
    const hasBodyLength = body.byteLength > 0;
    if (res.ok && is200 && hasBodyLength) {
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

function isKnownGatewayContentFormatException(ietf: string) {
  const exceptions = ["ceb"];
  return exceptions.includes(ietf);
}
function doCollateContent({
  isGateway,
  ietf,
}: {
  isGateway: boolean | undefined;
  ietf: string;
}) {
  return !isGateway || isKnownGatewayContentFormatException(ietf);
}
