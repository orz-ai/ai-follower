import { NextResponse } from "next/server";

import { getNewsById } from "../../../../lib/server/news";
import { startScheduler } from "../../../../lib/server/scheduler";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  startScheduler();
  const newsId = Number(params.id);
  if (!Number.isFinite(newsId)) {
    return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  }
  const item = getNewsById(newsId);
  if (!item) {
    return NextResponse.json({ detail: "News not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}
