"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProblemEntry, Difficulty } from "@/types";
import { bgGetAll, bgUpdateProblem, bgExport, bgImport, bgStats, bgClearAll } from "./api";
import { Search, Calendar, Download, Upload, Trash2, Edit3, ExternalLink, Clock, Target, Info, Clock1 } from "lucide-react";

type FilterState = {
  search: string;
  difficulty: Difficulty | "All";
  tag: string;
  onlyQueue: boolean;
};

const difficultyColors: Record<Difficulty, string> = {
  Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Hard: "text-red-600 bg-red-50 border-red-200",
  Unknown: "text-slate-500 bg-slate-50 border-slate-200",
};

function getTodayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function useProblems() {
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<{ total: number; byDifficulty: Record<string, number> } | null>(null);

  const refresh = async () => {
    setLoading(true);
    const res = await bgGetAll();
    if (res.ok && res.all) setProblems(res.all);
    const s = await bgStats();
    if (s.ok && s.stats) setCounts(s.stats);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { problems, setProblems, loading, counts, refresh };
}

export default function App() {
  const { problems, setProblems, loading, counts, refresh } = useProblems();
  const [filter, setFilter] = useState<FilterState>({ search: "", difficulty: "All", tag: "", onlyQueue: false });
  const [editing, setEditing] = useState<ProblemEntry | null>(null);
  const [tab, setTab] = useState<"all" | "review">("review");
  const [reviewDate, setReviewDate] = useState<string>(getTodayIso());

  const allTags = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => {
      p.tags.forEach((t) => set.add(t));
      p.customTags.forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [problems]);

  const filteredAll = useMemo(() => {
    const q = filter.search.toLowerCase().trim();
    return problems.filter((p) => {
      if (filter.onlyQueue && !p.inRevisionQueue) return false;
      if (filter.difficulty !== "All" && p.difficulty !== filter.difficulty) return false;
      if (filter.tag) {
        const all = new Set([...p.tags, ...p.customTags]);
        if (!all.has(filter.tag)) return false;
      }
      if (!q) return true;
      const hay = (p.title + " " + p.notes + " " + p.tags.join(" ") + " " + p.customTags.join(" ")).toLowerCase();
      return hay.includes(q);
    });
  }, [problems, filter]);

  const filteredReview = useMemo(() => {
    return problems.filter((p) => p.nextReviewDate === reviewDate);
  }, [problems, reviewDate]);

  const onSave = async (updates: Partial<ProblemEntry> & { id: string }) => {
    const res = await bgUpdateProblem(updates.id, updates);
    if (res.ok) {
      await refresh();
      setEditing(null);
    } else {
      alert("Failed to save");
    }
  };

  const doExport = async () => {
    const res = await bgExport();
    if (res.ok && res.json) {
      const blob = new Blob([JSON.stringify(res.json, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leetcode-revision-export.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const doImport = async (file: File) => {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      const res = await bgImport(json);
      if (res.ok) refresh();
    } catch {
      alert("Invalid JSON");
    }
  };

  const doClear = async () => {
    if (!confirm("This will clear all saved problems. Continue?")) return;
    const res = await bgClearAll();
    if (res.ok) {
      await refresh();
    } else {
      alert("Failed to clear data");
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
        <header className="flex-shrink-0 p-4 pb-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-0.5">LeetCode Revision</h1>
            <p className="text-slate-600 text-xs">Track your coding practice and schedule reviews</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
              onClick={doExport}
            >
              <Download size={14} />
              Export
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer shadow-sm">
              <Upload size={14} />
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) doImport(f);
                }}
              />
            </label>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors shadow-sm"
              onClick={doClear}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </header>

        <nav className="flex-shrink-0 px-4 pb-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg w-fit">
            <button
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "review" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              onClick={() => setTab("review")}
            >
              <Calendar size={14} />
              Review by Date
            </button>
            <button
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              onClick={() => setTab("all")}
            >
              <Target size={14} />
              All Problems
            </button>
          </div>
        </nav>

        {tab === "review" ? (
          <section className="flex-shrink-0 mx-4 mb-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <label className="text-xs font-medium text-slate-700">Review Date</label>
                <button className="text-slate-400 hover:text-slate-600" title="Problems scheduled for review on this specific date">
                  <Info size={12} />
                </button>
              </div>
              <input
                type="date"
                className="px-2 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
              />
            </div>
          </section>
        ) : (
          <section className="flex-shrink-0 mx-4 mb-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search problems by title, notes, or tags..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-medium text-slate-700">Difficulty</label>
                  <button className="text-slate-400 hover:text-slate-600" title="Filter by problem difficulty level">
                    <Info size={10} />
                  </button>
                </div>
                <select
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  value={filter.difficulty}
                  onChange={(e) => setFilter({ ...filter, difficulty: e.target.value as any })}
                >
                  <option>All</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Unknown</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-medium text-slate-700">Tags</label>
                  <button className="text-slate-400 hover:text-slate-600" title="Filter by problem tags and categories">
                    <Info size={10} />
                  </button>
                </div>
                <select
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  value={filter.tag}
                  onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
                >
                  <option value="">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500" checked={filter.onlyQueue} onChange={(e) => setFilter({ ...filter, onlyQueue: e.target.checked })} />
                <span className="text-xs font-medium text-slate-700">Show only revision queue</span>
                <button className="text-slate-400 hover:text-slate-600" title="Problems marked for quick revision">
                  <Info size={10} />
                </button>
              </label>

              {counts && (
                <div className="text-xs text-slate-600 font-medium">
                  <span className="mr-3">Total: {counts.total}</span>
                  <span className="text-emerald-600 mr-2">Easy: {counts.byDifficulty.Easy || 0}</span>
                  <span className="text-amber-600 mr-2">Medium: {counts.byDifficulty.Medium || 0}</span>
                  <span className="text-red-600">Hard: {counts.byDifficulty.Hard || 0}</span>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="flex-1 mx-4 mb-4 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-2 pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500 text-sm">Loading problems...</div>
              </div>
            ) : tab === "review" ? (
              filteredReview.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-slate-200">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
                  <div className="text-slate-500 font-medium text-sm">No problems scheduled for {reviewDate}</div>
                  <div className="text-slate-400 text-xs mt-1">Try selecting a different date or add review dates to your problems</div>
                </div>
              ) : (
                filteredReview.map((p) => <ProblemCard key={p.id} p={p} onSave={onSave} onEdit={() => setEditing(p)} />)
              )
            ) : filteredAll.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-slate-200">
                <Target size={32} className="mx-auto text-slate-300 mb-3" />
                <div className="text-slate-500 font-medium text-sm">No problems found</div>
                <div className="text-slate-400 text-xs mt-1">Try adjusting your filters or add some problems to get started</div>
              </div>
            ) : (
              filteredAll.map((p) => <ProblemCard key={p.id} p={p} onSave={onSave} onEdit={() => setEditing(p)} />)
            )}
          </div>
        </section>
        {tab === "review" && (
          <section className="flex-shrink-0 mx-4 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1 text-sm">About Revision Queue</h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  The revision queue is a quick way to flag problems you want to revisit soon. It works independently from scheduled review dates - use it as a to-do marker while the "Review by Date" tab shows problems
                  based on your calendar scheduling.
                </p>
              </div>
            </div>
          </section>
        )}

        {editing && <EditModal entry={editing} onClose={() => setEditing(null)} onSave={onSave} />}
      </div>
    </div>
  );
}

function ProblemCard({ p, onSave, onEdit }: { p: ProblemEntry; onSave: (u: Partial<ProblemEntry> & { id: string }) => void; onEdit: () => void }) {
  return (
    <article className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a href={p.url} target="_blank" className="font-medium text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 group text-sm" rel="noreferrer">
              <span className="truncate">{p.title}</span>
              <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600">{p.platform}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
            {/* <span className="text-slate-500">#{p.problemId}</span> */}
            <span className="text-slate-500">
              <Clock1 size={12} className="inline-block mr-1" />
              {p.nextReviewDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input
              type="checkbox"
              className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              checked={p.inRevisionQueue}
              onChange={async (e) => onSave({ id: p.id, inRevisionQueue: e.target.checked })}
            />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">Queue</span>
          </label>
          <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors" onClick={onEdit}>
            <Edit3 size={12} />
            Edit
          </button>
        </div>
      </div>

      {p.notes && (
        <div className="mb-2 p-2 bg-slate-50 rounded-md border border-slate-200">
          <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{p.notes}</p>
        </div>
      )}

      {[...p.tags, ...p.customTags].length > 0 && (
        <div className="flex flex-wrap gap-1">
          {[...p.tags, ...p.customTags].map((t) => (
            <span key={t} className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-sm">
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function EditModal({ entry, onClose, onSave }: { entry: ProblemEntry; onClose: () => void; onSave: (p: Partial<ProblemEntry> & { id: string }) => void }) {
  const [notes, setNotes] = useState(entry.notes || "");
  const [customTags, setCustomTags] = useState(entry.customTags.join(", "));
  const [nextDate, setNextDate] = useState(entry.nextReviewDate || "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Edit Problem</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="Add your notes, solution approach, or key insights..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Tags</label>
            <input
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="dynamic-programming, binary-search, graph (comma separated)"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Next Review Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
          <button className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            onClick={() =>
              onSave({
                id: entry.id,
                notes: notes.trim(),
                customTags: customTags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
                nextReviewDate: nextDate || undefined,
                updatedAt: Date.now(),
              })
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
