import { useState } from "react";
import { Eye, UserPlus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import SearchInput from "../../components/ui/SearchInput";

const MOCK_STUDENTS = [
  { id: "s1", name: "Fatima Ali", email: "fatima@onedge.co", courseId: "cr1", progress: 85, lastActive: "2024-04-20", certificateIssued: false, quizScores: [90, 80, 75], timeSpent: [120, 95, 60] },
  { id: "s2", name: "Carlos Ruiz", email: "carlos@onedge.co", courseId: "cr1", progress: 100, lastActive: "2024-04-19", certificateIssued: true, quizScores: [88, 92, 95], timeSpent: [140, 110, 75] },
  { id: "s3", name: "Omar Hassan", email: "omar@onedge.co", courseId: "cr2", progress: 45, lastActive: "2024-04-18", certificateIssued: false, quizScores: [70, 65], timeSpent: [90, 80] },
  { id: "s4", name: "Nina Patel", email: "nina@onedge.co", courseId: "cr2", progress: 30, lastActive: "2024-04-15", certificateIssued: false, quizScores: [60], timeSpent: [55] },
  { id: "s5", name: "James Lee", email: "james@onedge.co", courseId: "cr1", progress: 60, lastActive: "2024-04-17", certificateIssued: false, quizScores: [75, 80], timeSpent: [100, 85] },
];

export default function AdminStudents() {
  const { courses, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selected, setSelected] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ email: "", courseId: "" });

  const myCourses = courses.filter((c) => c.createdBy === currentUser.id && c.status === "live");

  const filtered = MOCK_STUDENTS.filter((s) => {
    if (courseFilter !== "all" && s.courseId !== courseFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <select className="select w-48 text-sm" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="all">All Courses</option>
              {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search students…" />
            <button className="btn-primary" onClick={() => setEnrollModal(true)}>
              <UserPlus size={14} />Manual Enroll
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header text-left">Student</th>
                <th className="table-header text-left">Course</th>
                <th className="table-header text-right">Progress</th>
                <th className="table-header text-left">Last Active</th>
                <th className="table-header text-left">Certificate</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const course = getCourse(s.courseId);
                return (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-xs text-gray-600">{course?.title ?? s.courseId}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${s.progress === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="table-cell text-xs text-gray-400">{s.lastActive}</td>
                    <td className="table-cell">
                      {s.certificateIssued
                        ? <span className="badge badge-live">Issued</span>
                        : <span className="badge badge-draft">Pending</span>
                      }
                    </td>
                    <td className="table-cell">
                      <button onClick={() => setSelected(s)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Student Progress Detail" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
                {selected.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-brand-600">{selected.progress}%</p>
                <p className="text-xs text-gray-400">Overall Progress</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Lesson Breakdown</p>
              {getCourse(selected.courseId)?.modules.map((mod, mi) => (
                <div key={mod.id} className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">{mod.title}</p>
                  {mod.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="flex items-center gap-3 py-1.5 pl-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${li < 2 ? "bg-emerald-500" : "bg-gray-200"}`}>
                        {li < 2 && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-xs text-gray-700 flex-1">{lesson.title}</span>
                      <span className="badge badge-draft text-xs">{lesson.type}</span>
                      {lesson.type === "quiz" && selected.quizScores[li] !== undefined && (
                        <span className="text-xs font-semibold text-brand-600">{selected.quizScores[li]}%</span>
                      )}
                      {selected.timeSpent[mi * 2 + li] && (
                        <span className="text-xs text-gray-400">{selected.timeSpent[mi * 2 + li]}m</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {selected.quizScores.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Quiz Scores</p>
                <div className="flex gap-2">
                  {selected.quizScores.map((score, i) => (
                    <div key={i} className={`text-center p-3 rounded-lg ${score >= 70 ? "bg-emerald-50" : "bg-red-50"}`}>
                      <p className={`text-lg font-bold ${score >= 70 ? "text-emerald-600" : "text-red-600"}`}>{score}%</p>
                      <p className="text-xs text-gray-400">Quiz {i + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Manual Enroll Modal */}
      <Modal open={enrollModal} onClose={() => setEnrollModal(false)} title="Manual Enrollment" size="sm">
        <div className="space-y-3">
          <div>
            <label className="label">Student Email</label>
            <input className="input" type="email" placeholder="student@email.com" value={enrollForm.email} onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Select Course</label>
            <select className="select" value={enrollForm.courseId} onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}>
              <option value="">— select course —</option>
              {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            The student will receive an enrollment notification via email.
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button className="btn-secondary" onClick={() => setEnrollModal(false)}>Cancel</button>
            <button className="btn-primary" disabled={!enrollForm.email || !enrollForm.courseId} onClick={() => setEnrollModal(false)}>
              <UserPlus size={14} />Enroll Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
