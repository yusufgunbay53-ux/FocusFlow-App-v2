import { AppState } from "@/types/models";

export type CoachTone = "great" | "ok" | "slow" | "idle";

export interface CoachMessage {
  tone: CoachTone;
  title: string;
  body: string;
}

export function generateCoachMessage(state: AppState): CoachMessage {
  const { tasks, stats } = state;
  const open = tasks.filter((t) => t.column !== "done").length;
  const highOpen = tasks.filter((t) => t.column !== "done" && t.priority === "high").length;
  const done = stats.completedToday;
  const focus = stats.focusMinutesToday;

  if (done >= 4 || focus >= 50) {
    return {
      tone: "great",
      title: "Bugun harika gidiyorsun!",
      body: `${done} gorev ve ${focus} dk odak. Ritmi koru.`,
    };
  }

  if (focus >= 25 && done >= 1) {
    return {
      tone: "ok",
      title: "Istikrarli bir tempo var",
      body: `Acik ${open} gorev kaldi. Bir sonraki Pomodoro'yu tek karta kilitle.`,
    };
  }

  if (highOpen > 0 && focus < 15) {
    return {
      tone: "slow",
      title: "Biraz yavalsadin",
      body: `${highOpen} yuksek oncelikli is bekliyor. 5 dakika mola vermek ister misin?`,
    };
  }

  return {
    tone: "idle",
    title: "Hazir oldugunda baslayalim",
    body: "Bir karti Yapiliyor'a tasi ve zamanlayiciyi calistir.",
  };
}

export async function fetchCoachFromApi(state: AppState): Promise<CoachMessage | null> {
  const endpoint = process.env.NEXT_PUBLIC_AI_COACH_URL;
  if (!endpoint) return null;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completedToday: state.stats.completedToday,
        focusMinutesToday: state.stats.focusMinutesToday,
        openTasks: state.tasks.filter((t) => t.column !== "done").length,
      }),
    });
    if (!res.ok) return null;
    return (await res.json()) as CoachMessage;
  } catch {
    return null;
  }
}
