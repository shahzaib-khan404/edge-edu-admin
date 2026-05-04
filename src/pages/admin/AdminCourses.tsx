import { useState } from "react";
import { Plus, Edit2, Trash2, Send, Eye } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SearchInput from "../../components/ui/SearchInput";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CourseWizard from "../shared/CourseWizard";
import type { Course } from "../../types";

export default function AdminCourses() {
  const { courses, setCourses, currentUser, settings, setNotifications } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const myCourses = courses.filter((c) => c.createdBy === currentUser.id).filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const saveCourse = (c: Course) => {
    setCourses((p) => {
      const exists = p.find((x) => x.id === c.id);
      return exists ? p.map((x) => x.id === c.id ? c : x) : [...p, c];
    });
    setWizardOpen(false);
    setEditingCourse(undefined);
  };

  const publish = (course: Course) => {
    if (settings.approvalWorkflow) {
      setCourses((p) => p.map((c) => c.id === course.id ? { ...c, status: "pending_review" } : c));
      setNotifications((p) => [{
        id: `n${Date.now()}`, type: "enrollment",
        title: "Course Submitted", message: `Your course '${course.title}' has been submitted for review.`,
        read: false, createdAt: new Date().toISOString(),
      }, ...p]);
    } else {
      setCourses((p) => p.map((c) => c.id === course.id ? { ...c, status: "live" } : c));
    }
  };

  const unpublish = (id: string) => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "draft" } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses((p) => p.filter((c) => c.id !== id));
  };

  return (
    <>
      {wizardOpen && (
        <CourseWizard
          course={editingCourse}
          onClose={() => { setWizardOpen(false); setEditingCourse(undefined); }}
          onSave={saveCourse}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {["all", "draft", "pending_review", "live"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? "bg-gray-900 text-white" : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"}`}>
                {s === "all" ? "All" : s === "pending_review" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1.5 text-xs opacity-60">
                  {s === "all" ? courses.filter((c) => c.createdBy === currentUser.id).length :
                    courses.filter((c) => c.createdBy === currentUser.id && c.status === s).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search courses…" />
            <button className="btn-primary" onClick={() => { setEditingCourse(undefined); setWizardOpen(true); }}>
              <Plus size={14} />Create Course
            </button>
          </div>
        </div>

        {myCourses.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-sm font-semibold text-gray-500 mb-1">No courses yet</p>
            <p className="text-xs text-gray-400 mb-4">Create your first course to get started</p>
            <button className="btn-primary" onClick={() => setWizardOpen(true)}><Plus size={14} />Create Course</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myCourses.map((c) => (
              <div key={c.id} className="card p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="w-28 h-18 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" style={{ height: 72 }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                      {c.subtitle && <p className="text-xs text-gray-500 mt-0.5">{c.subtitle}</p>}
                    </div>
                    <span className={`badge-${c.status === "live" ? "live" : c.status === "pending_review" ? "pending" : "draft"} shrink-0`}>
                      {c.status === "pending_review" ? "Pending Review" : c.status === "live" ? "Live" : "Draft"}
                    </span>
                  </div>
                  {c.rejectionNote && (
                    <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
                      <span className="font-semibold">Rejected:</span> {c.rejectionNote}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">{c.modules.length} modules</span>
                    <span className="text-xs text-gray-400">{c.enrollments} students</span>
                    {c.enrollments > 0 && <span className="text-xs text-gray-400">{c.completionRate}% completion</span>}
                    <span className="text-xs text-gray-400">{c.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status === "draft" && (
                    <button onClick={() => publish(c)} className="btn-primary py-1.5 px-3 text-xs gap-1">
                      <Send size={12} />{settings.approvalWorkflow ? "Submit for Review" : "Publish"}
                    </button>
                  )}
                  {c.status === "live" && (
                    <button onClick={() => unpublish(c.id)} className="btn-secondary py-1.5 px-3 text-xs gap-1">
                      <Eye size={12} />Unpublish
                    </button>
                  )}
                  {c.status === "pending_review" && (
                    <span className="text-xs text-amber-600 font-medium px-3">Awaiting SA review…</span>
                  )}
                  <button onClick={() => { setEditingCourse(c); setWizardOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCourse(deleteId!)}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
