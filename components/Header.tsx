import { Sparkles } from "lucide-react";
import { Stats } from "@/types/models";

export default function Header({ stats, taskCount }: { stats: Stats; taskCount: number }) {
  return (
    <header className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#00d2ff]/15 grid place-items-center text-[#00d2ff] shadow-neon">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight glow-text">FocusFlow</h1>
          <p className="text-xs text-cyan-100/50">AI destekli odaklanma asistani</p>
        </div>
      </div>
      <div className="flex gap-3 text-sm">
        <Stat label="Bugun" value={stats.completedToday} />
        <Stat label="Odak dk" value={stats.focusMinutesToday} />
        <Stat label="Gorev" value={taskCount} />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-cyan-400/10 bg-white/5 px-3 py-2 min-w-[88px]">
      <div className="text-[10px] uppercase tracking-wider text-cyan-100/40">{label}</div>
      <div className="text-lg font-semibold text-[#00d2ff]">{value}</div>
    </div>
  );
}
