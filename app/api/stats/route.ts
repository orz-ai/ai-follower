import { NextResponse } from "next/server";

import { countNews } from "../../../lib/server/news";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ total_news: countNews() });
}
