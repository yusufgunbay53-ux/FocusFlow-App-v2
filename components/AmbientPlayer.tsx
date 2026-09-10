"use client";
import { useState } from "react";
import { CloudRain, Music2, Volume2, VolumeX } from "lucide-react";
import { playLofi, playRain, setAmbientVolume, stopAmbient } from "@/lib/audio";

type Track = "off" | "rain" | "lofi";

export default function AmbientPlayer() {
  const [track, setTrack] = useState<Track>("off");
  const [vol, setVol] = useState(0.22);
  const [muted, setMuted] = useState(false);

  const apply = (t: Track, v: number) => {
    if (t === "off" || v === 0) { stopAmbient(); return; }
    if (t === "rain") playRain(v);
    if (t === "lofi") playLofi(v);
  };

  const select = (t: Track) => {
    const next = track === t ? "off" : t;
    setTrack(next);
    apply(next, muted ? 0 : vol);
  };

  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-cyan-100/80">Ortam sesi</h2>
        <button onClick={() => { const m = !muted; setMuted(m); if (m) stopAmbient(); else apply(track, vol); }} className="text-cyan-100/50 hover:text-[#00d2ff]">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => select("lofi")} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm ${track==="lofi"?"bg-[#00d2ff]/20 text-[#00d2ff] shadow-neon":"bg-white/5 text-cyan-100/60"}`}><Music2 size={16}/> Lo-Fi</button>
        <button onClick={() => select("rain")} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm ${track==="rain"?"bg-[#00d2ff]/20 text-[#00d2ff] shadow-neon":"bg-white/5 text-cyan-100/60"}`}><CloudRain size={16}/> Yagmur</button>
      </div>
      <input type="range" min={0} max={0.5} step={0.01} value={vol} onChange={(e) => { const v = Number(e.target.value); setVol(v); setAmbientVolume(muted ? 0 : v); }} className="mt-3 w-full accent-[#00d2ff]" />
    </section>
  );
}
