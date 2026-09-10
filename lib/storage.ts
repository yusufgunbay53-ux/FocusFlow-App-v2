import { AppState, STORAGE_KEY, emptyStats, Task, Stats } from "@/types/models";

const todayKey = () => new Date().toISOString().slice(0, 10);

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return { tasks: [], stats: emptyStats() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as AppState;
    return resetDailyIfNeeded(parsed);
  } catch {
    return seedState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDailyIfNeeded(state: AppState): AppState {
  const last = state.stats.lastActivityAt?.slice(0, 10);
  if (last && last !== todayKey()) {
    return {
      ...state,
      stats: {
        ...state.stats,
        completedToday: 0,
        focusMinutesToday: 0,
        lastActivityAt: new Date().toISOString(),
      },
    };
  }
  return state;
}

function seedState(): AppState {
  const now = new Date().toISOString();
  const tasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: "FocusFlow arayuzunu kesfet",
      notes: "Kanban kartlarini surukle, oncelik degistir.",
      priority: "medium",
      column: "todo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Ilk 25 dakikalik Pomodoro",
      priority: "high",
      column: "doing",
      createdAt: now,
      updatedAt: now,
    },
  ];
  const stats: Stats = { ...emptyStats(), lastActivityAt: now };
  const state = { tasks, stats };
  saveState(state);
  return state;
}

export function todayCompleted(tasks: Task[]) {
  const t = todayKey();
  return tasks.filter((x) => x.column === "done" && x.completedAt?.startsWith(t)).length;
}
