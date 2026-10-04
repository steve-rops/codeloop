import type { MetadataRoute } from "next";
import { SITE_NAME } from "./lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — web design & development`,
    short_name: SITE_NAME,
    description:
      "A freelance studio designing and building websites and web apps.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#fafafa",
    theme_color: "#0f0f0f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
