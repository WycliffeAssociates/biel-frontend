import {defineConfig, presetUno} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  // ...UnoCSS options
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno({
      // prefix:
    }),
  ],
  // content: {
  //   pipeline: {
  //     include: [
  //       /\.([jt]sx|mdx?|astro|html)($|\?)/,
  //       // include js/ts files
  //       "src/**/*.{js,ts}",
  //     ],
  //   },
  // },
});
