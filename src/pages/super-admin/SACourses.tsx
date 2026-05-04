import { useState } from "react";
import { Eye, Star, TrendingUp, BarChart2, Edit2, Trash2, CheckCircle, XCircle, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Course } from "../../types";

export default function SACourses() {
  const { courses, setCourses, users, categories } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewCourse, setReviewCourse] = useState<Course | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "queue">("all");

  const approve = (id: string) => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "live" } : c));
    setReviewCourse(null);
  };

  const reject = (id: string) => {
    if (!rejectNote.trim()) return;
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "draft", rejectionNote: rejectNote } : c));
    setReviewCourse(null);
    setRejectNote("");
  };

  const toggleFlag = (id: string, flag: "isFeatured" | "isTrending" | "isTopCourse") => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, [flag]: !c[flag] } : c));
  };

  const del = (id: string) => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "draft", deletedAt: new Date().toISOString() } as any : c));
  };

  const filtered = courses.filter((c) => {
    if (tab === "queue") return c.status === "pending_review";
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getAdmin = (id: string) => users.find((u) => u.id === id)?.name ?? id;
  const getCat = (id?: string) => categories.find((c) => c.id === id)?.name ?? "—";
  const queue = courses.filter((c) => c.status === "pending_review");

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        <button onClick={() => setTab("all")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === "all" ? "bg-brand-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>
          All Courses
        </button>
        <button onClick={() => setTab("queue")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === "queue" ? "bg-amber-500 text-white" : "text-gray-500 hover:text-gray-700"}`}>
          Approval Queue
          {queue.length > 0 && <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${tab === "queue" ? "bg-white text-amber-600" : "bg-amber-500 text-white"}`}>{queue.length}</span>}
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {tab === "all" && (
              <>
                <div className="flex items-center gap-1.5 text-gray-400"><Filter size={14} /></div>
                {["all", "draft", "pending_review", "live"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {s === "all" ? "All" : s === "pending_review" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </>
            )}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses…" />
        </div>

        {tab === "queue" && queue.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">All caught up! No courses pending review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header text-left">Course</th>
                  <th className="table-header text-left">Admin</th>
                  <th className="table-header text-left">Category</th>
                  <th className="table-header text-right">Enrollments</th>
                  <th className="table-header text-right">Completion</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Flags</th>
                  <th className="table-header text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm leading-tight">{c.title}</p>
                          <p className="text-xs text-gray-400">{c.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-gray-500 text-xs">{getAdmin(c.createdBy)}</td>
                    <td className="table-cell text-gray-500 text-xs">{getCat(c.category)}</td>
                    <td className="table-cell text-right font-medium">{c.enrollments}</td>
                    <td className="table-cell text-right">
                      <span className={`text-xs font-semibold ${c.completionRate > 70 ? "text-emerald-600" : c.completionRate > 40 ? "text-amber-600" : "text-gray-400"}`}>
                        {c.completionRate}%
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge-${c.status === "live" ? "live" : c.status === "pending_review" ? "pending" : "draft"}`}>
                        {c.status === "pending_review" ? "Pending" : c.status === "live" ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button title="Featured" onClick={() => toggleFlag(c.id, "isFeatured")} className={`p-1 rounded transition-colors ${c.isFeatured ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}><Star size={13} fill={c.isFeatured ? "currentColor" : "none"} /></button>
                        <button title="Trending" onClick={() => toggleFlag(c.id, "isTrending")} className={`p-1 rounded transition-colors ${c.isTrending ? "text-brand-500" : "text-gray-300 hover:text-brand-400"}`}><TrendingUp size={13} /></button>
                        <button title="Top Course" onClick={() => toggleFlag(c.id, "isTopCourse")} className={`p-1 rounded transition-colors ${c.isTopCourse ? "text-blue-500" : "text-gray-300 hover:text-blue-400"}`}><BarChart2 size={13} /></button>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        {c.status === "pending_review" && (
                          <button onClick={() => setReviewCourse(c)} className="btn-primary py-1 px-2 text-xs gap-1">
                            <Eye size={12} />Review
                          </button>
                        )}
                        {c.status !== "pending_review" && (
                          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors"><Edit2 size={13} /></button>
                        )}
                        <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-sm text-gray-400">No courses found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal open={!!reviewCourse} onClose={() => { setReviewCourse(null); setRejectNote(""); }} title="Review Course" size="xl">
        {reviewCourse && (
          <div className="space-y-4">
            <div className="flex gap-4">
              {reviewCourse.thumbnail && <img src={reviewCourse.thumbnail} alt="" className="w-32 h-20 rounded-lg object-cover" />}
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{reviewCourse.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{reviewCourse.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">By {getAdmin(reviewCourse.createdBy)} · {reviewCourse.department}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{reviewCourse.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Modules ({reviewCourse.modules.length})</p>
              {reviewCourse.modules.map((m) => (
                <div key={m.id} className="border border-gray-100 rounded-lg p-3 mb-2">
                  <p className="text-sm font-medium">{m.title}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {m.lessons.map((l) => (
                      <span key={l.id} className="badge badge-draft text-xs">{l.title} ({l.type})</span>
                    ))}
                  </div>
                </div>
              ))}
              {reviewCourse.modules.length === 0 && <p className="text-xs text-gray-400">No modules added yet</p>}
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Rejection Note (required to reject)</p>
              <textarea className="input" rows={3} placeholder="Explain why this course needs revision…" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} />
            </div>
            <div className="flex gap-3 justify-end">
              <button className="btn-danger" onClick={() => reject(reviewCourse.id)} disabled={!rejectNote.trim()}>
                <XCircle size={14} />Reject
              </button>
              <button className="btn-primary" onClick={() => approve(reviewCourse.id)}>
                <CheckCircle size={14} />Approve & Publish
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => del(deleteConfirm!)}
        title="Delete Course"
        message="This will soft-delete the course. Enrollments and progress will be preserved. Continue?"
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
