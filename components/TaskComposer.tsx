"use client";
import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Priority } from "@/types/models";

export default function TaskComposer({ onAdd }: { onAdd: (title: string, priority: Priority, notes?: string) => void }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority, notes.trim() || undefined);
    setTitle(""); setNotes(""); setPriority("medium");
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yeni gorev ekle..."
          className="flex-1 rounded-xl bg-white/5 border border-cyan-400/15 px-3 py-2.5 outline-none focus:border-[#00d2ff]/60 transition" />
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl bg-[#0b111e] border border-cyan-400/15 px-3 py-2.5 text-sm">
          <option value="low">Dusuk</option>
          <option value="medium">Orta</option>
          <option value="high">Yuksek</option>
        </select>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d2ff] text-[#0b111e] font-semibold px-4 py-2.5 hover:shadow-neon transition">
          <Plus size={16} /> Ekle
        </button>
      </div>
      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Not (istege bagli)"
        className="w-full rounded-xl bg-white/5 border border-cyan-400/10 px-3 py-2 text-sm outline-none" />
    </form>
  );
}
