"use client";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { AppState } from "@/types/models";
import { CoachMessage, fetchCoachFromApi, generateCoachMessage } from "@/lib/ai-coach";

export default function AiCoach({ state }: { state: AppState }) {
  const [msg, setMsg] = useState<CoachMessage>(() => generateCoachMessage(state));

  useEffect(() => {
    let cancelled = false;
    setMsg(generateCoachMessage(state));
    fetchCoachFromApi(state).then((remote) => {
      if (!cancelled && remote) setMsg(remote);
    });
    return () => { cancelled = true; };
  }, [state]);

  const accent = msg.tone === "great" ? "text-emerald-300" : msg.tone === "slow" ? "text-amber-300" : "text-[#00d2ff]";

  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-[#00d2ff]/15 grid place-items-center text-[#00d2ff]">
          <Bot size={16} />
        </div>
        <div>
          <h2 className="text-sm font-medium">AI Performans Kocu</h2>
          <p className="text-[10px] text-cyan-100/40">Mock + API hazir yapi</p>
        </div>
      </div>
      <p className={`text-sm font-medium ${accent}`}>{msg.title}</p>
      <p className="mt-1 text-sm text-cyan-100/70 leading-relaxed">{msg.body}</p>
    </section>
  );
}
