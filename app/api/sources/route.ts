import { NextResponse } from "next/server";

import { loadSources } from "../../../lib/server/sources";
import { startScheduler } from "../../../lib/server/scheduler";

export const runtime = "nodejs";

export async function GET() {
  startScheduler();
  return NextResponse.json(loadSources());
}
