import { NextResponse } from "next/server";

import { loadSources } from "../../../lib/server/sources";
import { startScheduler } from "../../../lib/server/scheduler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  startScheduler();
  return NextResponse.json(loadSources(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
