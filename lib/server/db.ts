import "server-only";

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DEFAULT_DB_PATH =
  process.env.DB_PATH || path.join(process.cwd(), "data", "news.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  summary TEXT,
  source TEXT NOT NULL,
  language TEXT,
  category TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source);
`;

let db: Database.Database | null = null;

function ensureParentDir(filePath: string) {
  const parent = path.dirname(filePath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
}

export function getDb() {
  if (!db) {
    ensureParentDir(DEFAULT_DB_PATH);
    db = new Database(DEFAULT_DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(SCHEMA);
  }
  return db;
}
