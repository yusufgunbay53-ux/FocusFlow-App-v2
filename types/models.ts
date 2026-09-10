export type Priority = "low" | "medium" | "high";
export type ColumnId = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  column: ColumnId;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PomodoroSession {
  id: string;
  mode: "focus" | "break";
  startedAt: string;
  endedAt?: string;
  durationSec: number;
  completed: boolean;
}

export interface Stats {
  completedToday: number;
  focusMinutesToday: number;
  lastActivityAt?: string;
  sessions: PomodoroSession[];
}

export interface AppState {
  tasks: Task[];
  stats: Stats;
}

export const STORAGE_KEY = "focusflow.v1";

export const emptyStats = (): Stats => ({
  completedToday: 0,
  focusMinutesToday: 0,
  sessions: [],
});
