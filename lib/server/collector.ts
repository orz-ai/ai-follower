import "server-only";

import Parser from "rss-parser";

import type { NewsInput } from "../types";
import { upsertNews } from "./news";
import { loadSources } from "./sources";

const parser = new Parser({
  headers: {
    "User-Agent":
      process.env.NEWS_USER_AGENT ||
      "AI-News-Aggregator/0.1 (+https://example.com)"
  }
});

function normalizeSummary(raw: string | null | undefined): string {
  if (!raw) return "";
  const text = raw
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
  return text;
}

export async function fetchRss({
  url,
  sourceName,
  language,
  category
}: {
  url: string;
  sourceName: string;
  language?: string | null;
  category?: string | null;
}): Promise<NewsInput[]> {
  const feed = await parser.parseURL(url);
  return (feed.items || []).map((item) => ({
    title: (item.title || "").trim(),
    link: (item.link || "").trim(),
    summary: normalizeSummary(
      (item.contentSnippet || item.content || "") as string
    ),
    source: sourceName,
    language: language || null,
    category: category || null,
    published_at: item.isoDate ? new Date(item.isoDate).toISOString() : null
  })).filter((item) => item.title && item.link);
}

export async function collectOnce() {
  const sources = loadSources();
  console.log("[collector] start collecting from", sources.length, "sources");
  let inserted = 0;
  for (const source of sources) {
    if (source.enabled === false) continue;
    try {
      const items = await fetchRss({
        url: source.url,
        sourceName: source.name,
        language: source.language,
        category: source.category
      });
      inserted += upsertNews(items);
      console.log(`[collector] ${source.name}: fetched ${items.length} items`);
    } catch (error) {
      console.warn("[collector] failed", source.name, source.url, error);
    }
  }
  console.log("[collector] finished, total inserted:", inserted);
  return inserted;
}
