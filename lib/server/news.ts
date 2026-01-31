import "server-only";

import { getDb } from "./db";
import type { NewsItem, NewsInput } from "../types";

export type { NewsItem, NewsInput };

const NEWS_FIELDS = [
  "title",
  "link",
  "summary",
  "source",
  "language",
  "category",
  "published_at"
] as const;

function nowIso() {
  return new Date().toISOString();
}

export function upsertNews(items: NewsInput[]) {
  if (!items?.length) return 0;
  const db = getDb();
  const stmt = db.prepare(
    `
    INSERT OR IGNORE INTO news (
      title, link, summary, source, language, category, published_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  );

  const insertMany = db.transaction((rows: NewsInput[]) => {
    let inserted = 0;
    for (const item of rows) {
      const values = NEWS_FIELDS.map((field) => item[field] ?? null);
      values.push(nowIso());
      const result = stmt.run(...values);
      inserted += result.changes;
    }
    return inserted;
  });

  return insertMany(items);
}

export function listNews({
  q,
  source,
  language,
  limit = 50,
  offset = 0
}: {
  q?: string;
  source?: string;
  language?: string;
  limit?: number;
  offset?: number;
}) {
  const db = getDb();
  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (q) {
    clauses.push("title LIKE ?");
    params.push(`%${q}%`);
  }
  if (source) {
    clauses.push("source = ?");
    params.push(source);
  }
  if (language) {
    clauses.push("language = ?");
    params.push(language);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sql = `
    SELECT * FROM news
    ${where}
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  return db.prepare(sql).all(...params) as NewsItem[];
}

export function getNewsById(id: number) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM news WHERE id = ?")
    .get(id) as NewsItem | undefined;
}

export function countNews() {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(1) AS total FROM news").get() as {
    total: number;
  };
  return row?.total ?? 0;
}
