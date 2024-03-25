import * as path from "node:path";
import {readFileSync, writeFileSync, readdirSync} from "node:fs";

export function getDevCachedPages(refresh = false) {
  if (refresh) return false;
  if (import.meta.env.DEV) {
    try {
      const cachePath = path.resolve("src/dev/pages");
      const pageDevCache = readdirSync(cachePath);
      let pages = pageDevCache.map((pagePath) => {
        const resolvedPath = path.resolve(`src/dev/pages/${pagePath}`);
        const page = readFileSync(resolvedPath, {
          encoding: "utf8",
        });
        const parsed = JSON.parse(page);
        return parsed;
      });
      return pages;
    } catch (error) {
      console.error(error);
    }
  }
}
export function getDevHomePage(refresh = false) {
  if (refresh) return false;
  if (import.meta.env.DEV) {
    const page = readFileSync("src/dev/home.json", {
      encoding: "utf8",
    });
    const parsed = JSON.parse(page);
    return parsed;
  }
}
export function cacheHomePageDev(payload: any) {
  if (import.meta.env.DEV) {
    const cachedVersion = JSON.stringify(payload);
    writeFileSync("src/dev/home.json", cachedVersion, {
      encoding: "utf8",
    });
  }
}
export function cachePageForDevSpeed(payload: any, path: string) {
  if (import.meta.env.DEV) {
    const cachedVersion = JSON.stringify(payload);
    writeFileSync(path, cachedVersion, {
      encoding: "utf8",
    });
  }
}

export function getCachedFooter(forceRefresh = false) {
  if (forceRefresh) return false;
  if (import.meta.env.DEV) {
    try {
      const page = readFileSync("src/dev/footer.json", {
        encoding: "utf8",
      });
      if (!page) return;
      const parsed = JSON.parse(page);
      return parsed;
    } catch (error) {
      return;
    }
  }
}
export function cacheFooterForDev(payload: any) {
  if (import.meta.env.DEV) {
    const cachedVersion = JSON.stringify(payload);
    writeFileSync("src/dev/footer.json", cachedVersion, {
      encoding: "utf8",
    });
  }
}
type cacheHeaderMenuArgs = {
  forceRefresh?: boolean;
  payload?: any;
  action: "get" | "put";
};
export function cacheHeaderMenu({
  forceRefresh,
  payload,
  action,
}: cacheHeaderMenuArgs) {
  const refresh = forceRefresh || false;

  if (import.meta.env.DEV) {
    if (action == "get") {
      if (refresh) return false;
      try {
        const menu = readFileSync("src/dev/menu.json", {
          encoding: "utf8",
        });
        if (!menu) return;
        const parsed = JSON.parse(menu);
        return parsed;
      } catch (error) {
        return;
      }
    } else if (action == "put") {
      const cachedVersion = JSON.stringify(payload);
      writeFileSync("src/dev/menu.json", cachedVersion, {
        encoding: "utf8",
      });
    }
  }
}
