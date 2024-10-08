// Type imports
import type {ManifestOptions} from "vite-plugin-pwa";

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: "Bible in Every Language", // Change this to your website's name.
  short_name: "Biel", // Change this to your website's short name.
  description: "A place to read Scripture online", // Change this to your websites description.
  theme_color: "#015AD9", // Change this to your primary color.
  background_color: "#ffffff", // Change this to your background color.
  // display: "minimal-ui",
  display: "minimal-ui",
  start_url: "/",
  icons: [],
};
