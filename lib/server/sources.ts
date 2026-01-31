import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { SourceItem } from "../types";

export type { SourceItem };

const DEFAULT_SOURCES: SourceItem[] = [
  {
    name: "WIRED AI",
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    language: "en",
    category: "media",
    enabled: true
  },
  {
    name: "The Guardian AI",
    url: "https://www.theguardian.com/technology/artificialintelligenceai/rss",
    language: "en",
    category: "media",
    enabled: true
  },
  {
    name: "ScienceDaily AI",
    url: "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml",
    language: "en",
    category: "research",
    enabled: true
  },
  {
    name: "BBC Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    language: "en",
    category: "media",
    enabled: true
  },
  {
    name: "Google AI Blog",
    url: "https://ai.googleblog.com/feeds/posts/default",
    language: "en",
    category: "official",
    enabled: true
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    language: "en",
    category: "official",
    enabled: true
  },
  {
    name: "机器之心",
    url: "https://www.jiqizhixin.com/rss",
    language: "zh",
    category: "media",
    enabled: true
  }
];

function resolveSourcesPath() {
  const configured = process.env.SOURCES_FILE;
  if (configured && fs.existsSync(configured)) {
    return configured;
  }
  const cwdPath = path.join(process.cwd(), "sources.json");
  if (fs.existsSync(cwdPath)) {
    return cwdPath;
  }
  return null;
}

export function loadSources(): SourceItem[] {
  const sourcesPath = resolveSourcesPath();
  if (sourcesPath) {
    try {
      const raw = fs.readFileSync(sourcesPath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data;
      }
    } catch {
      // Fall through to defaults
    }
  }
  return DEFAULT_SOURCES;
}
