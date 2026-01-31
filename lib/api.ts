import { API_BASE_URL } from "./config";
import type { NewsItem, SourceItem, Stats, NewsQuery } from "./types";

export type { NewsItem, SourceItem, Stats, NewsQuery };

async function safeFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store"
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchNews(
  params: NewsQuery = {}
): Promise<NewsItem[] | null> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.source) query.set("source", params.source);
  if (params.language) query.set("language", params.language);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));

  const path = `/news${query.toString() ? `?${query}` : ""}`;
  return safeFetch<NewsItem[]>(path);
}

export async function fetchStats(): Promise<Stats | null> {
  return safeFetch<Stats>("/stats");
}

export async function fetchSources(): Promise<SourceItem[] | null> {
  return safeFetch<SourceItem[]>("/sources");
}
