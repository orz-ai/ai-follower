import "server-only";

import { collectOnce } from "./collector";

type SchedulerState = {
  started: boolean;
  intervalId?: NodeJS.Timeout;
};

const globalState = globalThis as typeof globalThis & {
  __aiNewsScheduler?: SchedulerState;
};

function getState(): SchedulerState {
  if (!globalState.__aiNewsScheduler) {
    globalState.__aiNewsScheduler = { started: false };
  }
  return globalState.__aiNewsScheduler;
}

export function startScheduler() {
  const state = getState();
  if (state.started) return;

  if ((process.env.ENABLE_SCHEDULER || "true").toLowerCase() !== "true") {
    console.log("[scheduler] disabled by environment variable");
    return;
  }

  const intervalHours = Number(process.env.NEWS_FETCH_INTERVAL_HOURS || "2");
  const intervalMs = Math.max(1, intervalHours) * 60 * 60 * 1000;

  state.started = true;
  console.log("[scheduler] started, interval:", intervalHours, "hours");

  void collectOnce();
  state.intervalId = setInterval(() => {
    console.log(`[scheduler] running at ${new Date().toISOString()}`);
    void collectOnce();
  }, intervalMs);
}
