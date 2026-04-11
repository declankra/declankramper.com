import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/candidate-profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/api/",
      },
    ],
    host: SITE_URL,
  };
}
