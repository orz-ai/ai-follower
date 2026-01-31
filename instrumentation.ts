import { startScheduler } from "./lib/server/scheduler";

export async function register() {
  const runtime = process.env.NEXT_RUNTIME;
  if (runtime && runtime !== "nodejs") return;
  startScheduler();
}
