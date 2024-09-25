import {defineConfig, presetUno, type UserConfig} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import presetIcons from "@unocss/preset-icons";

// const uno = presetUno();
// console.log("containers");
const config: UserConfig = {
  // ...UnoCSS options
  transformers: [transformerDirectives(), transformerVariantGroup()],
  variants: [
    (matcher) => {
      if (!matcher.startsWith("fullscreen:")) {
        return matcher;
      }
      return {
        matcher: matcher.slice("fullscreen:".length),
        selector: (s) => `${s}:fullscreen`,
      };
    },
  ],
  presets: [
    presetUno({
      // prefix:
    }),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  theme: {
    maxWidth: {
      prose: "75ch",
    },
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
    keyframes: {
      "indeterminate-progress": {
        "0%": {translateX: "0", scaleX: "0"},
        "40%": {translateX: "0", scaleX: ".4"},
        "100%": {translateX: "100%", scaleX: ".5"},
      },
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
      const recurse = (
        path: string,
        value: string | Record<string, string>
      ): string[] => {
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
  "w-full",
  "h-full!",
  "w-full!",
  "absolute",
  "relative",
  "object-cover",
  "top-0",
  "bottom-0",
  "left-0",
  "right-0",
  "inset-0",
  "overflow-hidden",
  "pb-0!",
  "pr-0!",
  "pl-0!",
  "hidden!",
  "md:block!",
  "md:flex!",
  "bg-brand-light",
  "shadow-lg",
  "list-none!",
  "decoration-none!",
];

export default defineConfig(config);
