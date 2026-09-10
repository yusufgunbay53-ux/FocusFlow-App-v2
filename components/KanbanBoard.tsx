"use client";
import { DragEvent, useState } from "react";
import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";
import { ColumnId, Priority, Task } from "@/types/models";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Yapilacaklar" },
  { id: "doing", title: "Yapiliyor" },
  { id: "done", title: "Tamamlandi" },
];

const PRIORITY: Record<Priority, { label: string; className: string }> = {
  low: { label: "Dusuk", className: "bg-slate-500/20 text-slate-200" },
  medium: { label: "Orta", className: "bg-cyan-400/15 text-cyan-200" },
  high: { label: "Yuksek", className: "bg-rose-500/20 text-rose-200" },
};

export default function KanbanBoard({
  tasks, onMove, onEdit, onDelete,
}: {
  tasks: Task[];
  onMove: (id: string, column: ColumnId) => void;
  onEdit: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const [over, setOver] = useState<ColumnId | null>(null);
  const onDrop = (e: DragEvent, column: ColumnId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/task-id");
    if (id) onMove(id, column);
    setOver(null);
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {COLUMNS.map((col) => (
        <div key={col.id}
          onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
          onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
          onDrop={(e) => onDrop(e, col.id)}
          className={`glass rounded-2xl p-3 min-h-[280px] ${over === col.id ? "ring-1 ring-[#00d2ff]/50" : ""}`}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-medium text-cyan-100/80">{col.title}</h2>
            <span className="text-xs text-cyan-100/40">{tasks.filter((t) => t.column === col.id).length}</span>
          </div>
          <div className="space-y-2">
            {tasks.filter((t) => t.column === col.id).map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete}
                onCheck={() => onMove(task.id, task.column === "done" ? "todo" : "done")} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onCheck }: {
  task: Task;
  onEdit: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onCheck: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const save = () => {
    const t = title.trim();
    if (t && t !== task.title) onEdit(task.id, { title: t });
    setEditing(false);
  };
  return (
    <article draggable onDragStart={(e) => { e.dataTransfer.setData("text/task-id", task.id); e.dataTransfer.effectAllowed = "move"; }}
      className="rounded-xl border border-white/5 bg-white/[0.04] p-3 hover:border-[#00d2ff]/30 transition cursor-grab">
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="mt-1 text-cyan-100/30" />
        <div className="flex-1 min-w-0">
          {editing ? (
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={save}
              onKeyDown={(e) => e.key === "Enter" && save()} className="w-full bg-transparent border-b border-[#00d2ff]/40 outline-none text-sm" />
          ) : (
            <p className={`text-sm ${task.column === "done" ? "line-through text-cyan-100/40" : ""}`}>{task.title}</p>
          )}
          {task.notes && <p className="mt-1 text-xs text-cyan-100/40 line-clamp-2">{task.notes}</p>}
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${PRIORITY[task.priority].className}`}>{PRIORITY[task.priority].label}</span>
            <div className="flex gap-1">
              <button type="button" onClick={onCheck} className="p-1.5 rounded-lg text-cyan-100/50 hover:text-[#00d2ff]"><Check size={14} /></button>
              <button type="button" onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-cyan-100/50 hover:text-[#00d2ff]"><Pencil size={14} /></button>
              <button type="button" onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-cyan-100/50 hover:text-[#00d2ff]"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
