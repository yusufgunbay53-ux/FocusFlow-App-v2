"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { playChime } from "@/lib/audio";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export default function PomodoroTimer({ onFocusComplete }: { onFocusComplete: (minutes: number) => void }) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    setRunning(false);
    playChime();
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("FocusFlow", { body: mode === "focus" ? "Odak suresi bitti. 5 dk mola!" : "Mola bitti." });
    }
    if (mode === "focus") onFocusComplete(25);
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setLeft(next === "focus" ? FOCUS : BREAK);
  }, [left, mode, onFocusComplete]);

  const total = mode === "focus" ? FOCUS : BREAK;
  const pct = Math.max(0, Math.min(100, ((total - left) / total) * 100));
  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-cyan-100/80">Pomodoro</h2>
        <div className="flex gap-1 text-xs">
          <button onClick={() => { setMode("focus"); setLeft(FOCUS); setRunning(false); }} className={`rounded-lg px-2 py-1 ${mode==="focus"?"bg-[#00d2ff]/20 text-[#00d2ff]":"text-cyan-100/40"}`}>Odak 25</button>
          <button onClick={() => { setMode("break"); setLeft(BREAK); setRunning(false); }} className={`rounded-lg px-2 py-1 ${mode==="break"?"bg-[#00d2ff]/20 text-[#00d2ff]":"text-cyan-100/40"}`}>Mola 5</button>
        </div>
      </div>
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2ff" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`} />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-3xl font-semibold tabular-nums glow-text">{mm}:{ss}</div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-100/40">{mode === "focus" ? "calisma" : "mola"}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => {
          if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
          setRunning((r) => !r);
        }} className="inline-flex items-center gap-2 rounded-xl bg-[#00d2ff] text-[#0b111e] font-semibold px-4 py-2 hover:shadow-neon">
          {running ? <Pause size={16} /> : <Play size={16} />} {running ? "Duraklat" : "Baslat"}
        </button>
        <button onClick={() => { setRunning(false); setLeft(mode === "focus" ? FOCUS : BREAK); }} className="rounded-xl border border-cyan-400/20 px-3 py-2">
          <RotateCcw size={16} />
        </button>
      </div>
    </section>
  );
}
