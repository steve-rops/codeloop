import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// Every crawler that fetches this file is told the same thing: all of it is
// public. The AI crawlers are named one by one because several of them treat
// a rule addressed to them as the only one that counts, and their absence
// from a file is read as a refusal by some; /llms.txt is the plain-text
// summary written for them.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
