// import { readFile, writeFile, stat } from "fs/promises"
import {globSync} from "glob";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {PurgeCSS} from "purgecss";
import {DOMParser} from "linkedom/worker";

// Step 1, get the content of each .html file. Feed content to domParser. Grab the style#headlessStyles.  Purge with content as raw content, and with that style tag as raw css.  Write back out to that file now that style tag is lesser.
const srcFiles = globSync("./dist/**/*.html");
// Safe text-black and bg-transparent for translations page bug
const safelistPattern = [
  /\[.+\]/, //arbitrary variants
  /breakout$/,
  /text-black/,
  /bg-transparent/,
  /contain/,
  /^(hover|focus|active).*/, //class states like .hover\:font
  /.*(group).*/, //group variants
];
const greedySafe = [];

async function handleInlineStyleInGeneratedFiles() {
  for await (const filepath of srcFiles) {
    const text = await fs.readFile(path.resolve(`./${filepath}`), {
      encoding: "utf-8",
    });
    const thatDom = new DOMParser().parseFromString(text, "text/html");
    const inlineStyles = thatDom.querySelector("style#headlessStyles");
    if (!inlineStyles) continue;
    const rawCss = inlineStyles?.innerHTML;
    // We are stripping out all the styles here, bc we want to separate inline from the content.  For inline styles, if it's not used on page, then we will get rid of it.
    let withoutInlinedStyleTag = text.replace(
      inlineStyles.innerHTML,
      "/* REPLACEMEPURGECSS */"
    );

    const purgeCss = new PurgeCSS();

    const result = await purgeCss.purge({
      content: [{raw: withoutInlinedStyleTag, extension: "html"}],
      css: [{raw: rawCss}],
      variables: true,
      keyframes: true,
      safelist: {
        standard: safelistPattern,
        greedy: greedySafe,
      },
      rejected: true, //for debuggin
      rejectedCss: true, //for debuggin
    });
    const singleResult = result[0];
    const replacedOriginal = withoutInlinedStyleTag.replace(
      "/* REPLACEMEPURGECSS */",
      singleResult.css
    );
    console.log(
      `Eliminated ${singleResult.rejectedCss?.length} chars in ${filepath}`
    );
    console.log(`inline style size for ${filepath} is ${singleResult?.length}`);
    await fs.writeFile(filepath, replacedOriginal);
    // const bytes = await Bun.write(path, replacedOriginal);
    // }
  }
}

await handleInlineStyleInGeneratedFiles();
async function purgeAgainstAdditionalGlobals() {
  const purgeCss = new PurgeCSS();

  // todo: default extractor doesn't consider @, :, and /, so it isn't picking up stuff like md:block in server routes.  Just ignore this add'l globals route for now and only purge inline styles
  const results = await purgeCss.purge({
    content: ["./dist/**/*.html", "./dist/**/*.js", "./dist/**/*.mjs"],
    css: ["./dist/**/*.css"],
    variables: true,
    rejected: true,
    safelist: {
      standard: safelistPattern,
    },
    rejectedCss: true,
  });
  results
    .filter((r) => !!r.file)
    .forEach((res) => {
      console.log(`Eliminated ${res.rejectedCss?.length} in ${res.file}`);

      fs.writeFile(res.file, res.css, {
        encoding: "utf-8",
      });
    });
}
// await purgeAgainstAdditionalGlobals();
