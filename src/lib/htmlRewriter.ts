import type {Element as CfElement} from "@cloudflare/workers-types";

export type handlerTypes = "DEFAULT" | "TW";
const externalReader = "https://read.bibleineverylanguage.org";

export class ATagHandler {
  private functionContext: "DEFAULT" | "TW";

  constructor(functionContext: "DEFAULT" | "TW") {
    this.functionContext = functionContext;
  }

  public element(element: CfElement): void {
    const href = element.getAttribute("href");
    if (!href) return;

    switch (this.functionContext) {
      case "DEFAULT":
        this.handleTN(element, href);
        break;
      case "TW":
        this.handleTW(element, href);
        break;
      // case "TM":
      //   this.handleTM(element, href);
      //   break;
      default:
        break;
    }
  }

  private handleTN(element: CfElement, href: string): void {
    const rcLink = element.getAttribute("data-is-rc-link");
    // bool attr, no value, so '' is truthy. Hence strictly not null
    if (href && rcLink !== null) {
      handleRcLinks(element, href);
    } else if (href.includes("tn-chunk")) {
      handleInteralTnLinks(element, href);
    }
  }

  private handleTW(element: CfElement, href: string): void {
    handleTwLinks(element, href);
  }

  // private handleTM(element: Element, href: string): void {
  //   handleTMLinks(element, href);
  // }
}
export class ImgTagRemover {
  element(element: CfElement) {
    element.remove();
  }
}
export class SpanifyDeadALinks {
  element(element: CfElement) {
    const href = element.getAttribute("href");
    if (href && !href.startsWith("rc://")) return;
    element.tagName = "span";
  }
}
// const ATagRewriter

export function handleRcLinks(element: CfElement, href: string) {
  if (!element || !href || alreadyPointsToExternalReader(href)) return;
  const linkUser = element.getAttribute("data-user");
  const repo = element.getAttribute("data-repo");
  if (!repo) return;
  const category = element.getAttribute("data-category");
  const word = element.getAttribute("data-word");
  const templateType = element.getAttribute("data-type");
  if (templateType === "tw") {
    const newHref = `${externalReader}/${linkUser}/${repo}?section=${category}#${word}`;
    // const newHref = `/${linkUser}/${repo}?section=${category}#${word}`;
    element.setAttribute("href", newHref);
    element.setInnerContent(word!);
  } else if (templateType === "tm") {
    rewriteTmLinks(element);
  }
}

function handleInteralTnLinks(element: CfElement, href: string) {
  const hashWithoutHashTag = href.split("#")[1];
  if (!hashWithoutHashTag) return hashWithoutHashTag;
  const parts = hashWithoutHashTag.split("-");
  const book = parts[2];
  const chapter = parts[3];

  const newUrl = `?book=${book}&chapter=${chapter}#${hashWithoutHashTag}`;
  element.setAttribute("href", newUrl);
  element.setAttribute("data-chapter", chapter!);
  element.setAttribute("data-book", book!);
  element.setAttribute("data-hash", hashWithoutHashTag);
  element.setAttribute("data-internalTn", "true");
}

function handleTwLinks(element: CfElement, href: string) {
  if (!href || alreadyPointsToExternalReader(href)) return;

  if (href?.includes("/u/")) {
    return rewriteTmLinks(element);
  }
  const rep = href.replace(".html", "");
  const parts = rep.split("#");
  const section = parts[0];
  const hash = parts[1];
  // const newUrl = `#${parts[1]}`;
  element.setAttribute("href", `#${hash}`);
  element.setAttribute("data-section", section!);
  element.setAttribute("data-hash", hash!);
  element.setAttribute("data-crossref", "true");
}

function rewriteTmLinks(element: CfElement) {
  const linkUser = element.getAttribute("data-user");
  const initialPage = element.getAttribute("data-page");
  const topic = element.getAttribute("data-topic");
  const repo = element.getAttribute("data-repo");

  const newHref = `${externalReader}/${linkUser}/${repo}?section=${initialPage}#${topic}`;
  element.setAttribute("href", newHref);
  element.setInnerContent(topic!);
}

function alreadyPointsToExternalReader(href: string) {
  return href.includes(externalReader);
}
