"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import TaskComposer from "@/components/TaskComposer";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientPlayer from "@/components/AmbientPlayer";
import AiCoach from "@/components/AiCoach";
import { loadState, saveState, todayCompleted } from "@/lib/storage";
import { AppState, ColumnId, Priority, Task } from "@/types/models";

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { setState(loadState()); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  }, []);

  const addTask = (title: string, priority: Priority, notes?: string) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(), title, notes, priority,
      column: "todo", createdAt: now, updatedAt: now,
    };
    update((s) => ({ ...s, tasks: [task, ...s.tasks] }));
  };

  const moveTask = (id: string, column: ColumnId) => {
    update((s) => {
      const tasks = s.tasks.map((t) => {
        if (t.id !== id) return t;
        const now = new Date().toISOString();
        return { ...t, column, updatedAt: now, completedAt: column === "done" ? now : undefined };
      });
      return {
        ...s, tasks,
        stats: { ...s.stats, completedToday: todayCompleted(tasks), lastActivityAt: new Date().toISOString() },
      };
    });
  };

  const editTask = (id: string, patch: Partial<Task>) => {
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t),
    }));
  };

  const deleteTask = (id: string) => {
    update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  };

  const onFocusComplete = (minutes: number) => {
    update((s) => ({
      ...s,
      stats: {
        ...s.stats,
        focusMinutesToday: s.stats.focusMinutesToday + minutes,
        lastActivityAt: new Date().toISOString(),
        sessions: [...s.stats.sessions, {
          id: crypto.randomUUID(), mode: "focus",
          startedAt: new Date(Date.now() - minutes * 60000).toISOString(),
          endedAt: new Date().toISOString(), durationSec: minutes * 60, completed: true,
        }],
      },
    }));
  };

  if (!state) {
    return <main className="min-h-screen grid place-items-center text-cyan-200/70">Yukleniyor...</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <Header stats={state.stats} taskCount={state.tasks.length} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <TaskComposer onAdd={addTask} />
          <KanbanBoard tasks={state.tasks} onMove={moveTask} onEdit={editTask} onDelete={deleteTask} />
        </section>
        <aside className="space-y-4">
          <PomodoroTimer onFocusComplete={onFocusComplete} />
          <AmbientPlayer />
          <AiCoach state={state} />
        </aside>
      </div>
    </main>
  );
}
