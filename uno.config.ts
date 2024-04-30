import {defineConfig, presetUno, type UserConfig} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

// const uno = presetUno();
// console.log("containers");
const config: UserConfig = {
  // ...UnoCSS options
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno({
      // prefix:
    }),
  ],
  theme: {
    colors: {
      brand: {
        base: "hsla(var(--clr-brand-base))",
        dark: "hsla(var(--clr-brand-dark))",
        light: "hsla(var(--clr-brand-light))",
        darkest: "hsla(var(--clr-brand-darkest))",
      },
      onSurface: {
        primary: "hsla(var(--clr-on-surface-primary))",
        secondary: "hsla(var(--clr-on-surface-secondary))",
        tertiary: "hsla(var(--clr-on-surface-tertiary))",
        invert: "hsla(var(--clr-on-surface-invert))",
      },
      surface: {
        primary: "hsla(var(--clr-surface-primary))",
        secondary: "hsla(var(--clr-surface-secondary))",
        tertiary: "hsla(var(--clr-surface-tertiary))",
        border: "hsla(var(--clr-surface-border))",
        invert: "hsla(var(--clr-surface-invert))",
        overlay: "hsla(var(--clr-surface-overlay))",
      },
      error: {
        surface: "hsla(var(--clr-surface-error))",
        onSurface: "hsla(var(--clr-on-surface-error))",
      },
      success: {
        surface: "hsla(var(--clr-surface-success))",
        onSurface: "hsla(var(--clr-on-surface-success))",
      },
    },
    boxShadow: {
      // x, y, blur, spread, radius, color
      sm: "0 1px 2px 0 hsla(0, 0%, 12.2%, 24%), 0 1px 3px 0 hsla(0, 0%, 12.2%, 12%)",
      md: "0 6px 6px 0 hsla(0, 0%, 12.2%, 23%), 0 10px 20px 0 hsla(0, 0%, 12.2%, 19%)",
      lg: "0 15px 12px 0 hsla(0, 0%, 12.2%, 22%), 0 19px 38px 0 hsla(0, 0%, 12.2%, 30%)",
    },
  },

  // rules: [["contain", {"max-width": "1440px", margin: "0 auto"}]],
  // content: {
  //   pipeline: {
  //     include: [
  //       /\.([jt]sx|mdx?|astro|html)($|\?)/,
  //       // include js/ts files
  //       "src/**/*.{js,ts}",
  //     ],
  //   },
  // },
};

// @ts-ignore
const generateSafelistColors = (
  prefixes: string[],
  themeColors: Record<string, string | Record<string, string>>
) => {
  return prefixes.flatMap((prefix) => {
    return Object.entries(themeColors).flatMap(([key, value]) => {
      // @ts-ignore
      const recurse = (
        path: string,
        value: string | Record<string, string>
      ) => {
        if (typeof value === "string") {
          return [`${prefix}-${path}`];
        } else {
          return Object.entries(value).flatMap(([subKey, subValue]) =>
            recurse(`${path}-${subKey}`, subValue)
          );
        }
      };
      return recurse(key, value);
    });
  });
};
const safelistColors = generateSafelistColors(
  ["text", "bg"],
  // @ts-ignore
  config.theme?.colors ?? {}
);
config.safelist = [
  ...safelistColors,
  "h-full",
  "absolute",
  "relative",
  "object-cover",
  "top-0",
];

export default defineConfig(config);
