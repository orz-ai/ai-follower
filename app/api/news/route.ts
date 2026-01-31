import { NextResponse } from "next/server";

import { listNews } from "../../../lib/server/news";
import { startScheduler } from "../../../lib/server/scheduler";

export const runtime = "nodejs";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export async function GET(request: Request) {
  startScheduler();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const source = searchParams.get("source") || undefined;
  const language = searchParams.get("language") || undefined;
  const limit = clamp(Number(searchParams.get("limit") || 50), 1, 100);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

  const data = listNews({ q, source, language, limit, offset });
  return NextResponse.json(data);
}
