import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FocusFlow",
    short_name: "FocusFlow",
    start_url: "/",
    display: "standalone",
    background_color: "#0b111e",
    theme_color: "#0b111e",
  };
}
