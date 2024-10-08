export const constants = {
  apiFetchExternal: "/api/fetchExternal",
  apiDocStart: "/api/doc",
  apiPollDoc: "/api/pollDoc",
  apiTriggerDownload: "/api/pollDoc",
  apiFallbackSwZip: "/api/swFallbackSourceZip",
  headerOctectStream: "application/octet-stream",
  swKeepAlive: "/sw/keepAlive",
  swProxyDataJsSelector: "proxy-source-zips",
  swProxyZipsFormAction: "/sw-proxy-zip",
  uiProxyDocQuerySelector: "proxy-sw-doc",
  injectRegex: /<div[^>]*\bid="injectStaticSearch"[^>]*>.*?<\/div>/gim,
  searchAsPageQuerySelector: "search-as-page",
};
