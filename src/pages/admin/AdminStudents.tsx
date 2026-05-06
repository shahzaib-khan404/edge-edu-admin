import { useState } from "react";
import { Eye, UserPlus, RotateCcw, SkipForward, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SearchInput from "../../components/ui/SearchInput";
import type { StudentEnrollment, ModuleProgress, LessonStatus } from "../../types";

const INITIAL_STUDENTS: StudentEnrollment[] = [
  {
    id: "s1", name: "Fatima Ali", email: "fatima@onedge.co", courseId: "cr1",
    progress: 75, lastActive: "2024-04-20", certificateIssued: false,
    modules: [
      { moduleId: "m1", lessons: [
        { lessonId: "ls1", status: "completed", timeSpent: 120 },
        { lessonId: "ls2", status: "completed", quizScore: 90, timeSpent: 95 },
      ]},
      { moduleId: "m2", lessons: [
        { lessonId: "ls3", status: "completed", quizScore: 80, timeSpent: 60 },
        { lessonId: "ls4", status: "not_started" },
      ]},
    ],
  },
  {
    id: "s2", name: "Carlos Ruiz", email: "carlos@onedge.co", courseId: "cr1",
    progress: 100, lastActive: "2024-04-19", certificateIssued: true,
    modules: [
      { moduleId: "m1", lessons: [
        { lessonId: "ls1", status: "completed", timeSpent: 140 },
        { lessonId: "ls2", status: "completed", quizScore: 88, timeSpent: 110 },
      ]},
      { moduleId: "m2", lessons: [
        { lessonId: "ls3", status: "completed", quizScore: 92, timeSpent: 75 },
        { lessonId: "ls4", status: "completed", timeSpent: 60 },
      ]},
    ],
  },
  {
    id: "s3", name: "Omar Hassan", email: "omar@onedge.co", courseId: "cr2",
    progress: 45, lastActive: "2024-04-18", certificateIssued: false,
    modules: [],
  },
  {
    id: "s4", name: "Nina Patel", email: "nina@onedge.co", courseId: "cr2",
    progress: 30, lastActive: "2024-04-15", certificateIssued: false,
    modules: [],
  },
  {
    id: "s5", name: "James Lee", email: "james@onedge.co", courseId: "cr1",
    progress: 50, lastActive: "2024-04-17", certificateIssued: false,
    modules: [
      { moduleId: "m1", lessons: [
        { lessonId: "ls1", status: "completed", timeSpent: 100 },
        { lessonId: "ls2", status: "completed", quizScore: 75, timeSpent: 85 },
      ]},
      { moduleId: "m2", lessons: [
        { lessonId: "ls3", status: "not_started" },
        { lessonId: "ls4", status: "not_started" },
      ]},
    ],
  },
];

function calcProgress(enrollment: StudentEnrollment): number {
  const all = enrollment.modules.flatMap((m) => m.lessons);
  if (all.length === 0) return enrollment.progress;
  const done = all.filter((l) => l.status === "completed" || l.status === "skipped").length;
  return Math.round((done / all.length) * 100);
}

function resetModules(modules: ModuleProgress[]): ModuleProgress[] {
  return modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({ lessonId: l.lessonId, status: "not_started" as LessonStatus })),
  }));
}

function skipLesson(modules: ModuleProgress[], moduleId: string, lessonId: string): ModuleProgress[] {
  return modules.map((m) =>
    m.moduleId !== moduleId ? m : {
      ...m,
      lessons: m.lessons.map((l) =>
        l.lessonId !== lessonId ? l : { ...l, status: "skipped" as LessonStatus, skippedAt: new Date().toISOString() }
      ),
    }
  );
}

function LessonStatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed")   return <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />;
  if (status === "skipped")     return <SkipForward  size={15} className="text-amber-400 shrink-0" />;
  if (status === "in_progress") return <Loader2      size={15} className="text-blue-400 shrink-0" />;
  return <Circle size={15} className="text-gray-300 shrink-0" />;
}

export default function AdminStudents() {
  const { courses, currentUser } = useApp();
  const [students, setStudents] = useState<StudentEnrollment[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ email: "", courseId: "" });
  const [confirmReset, setConfirmReset] = useState(false);
  const [skipTarget, setSkipTarget] = useState<{ moduleId: string; lessonId: string; title: string } | null>(null);

  const selected = students.find((s) => s.id === selectedId) ?? null;
  const myCourses = courses.filter((c) => c.createdBy === currentUser.id && c.status === "live");

  const filtered = students.filter((s) => {
    if (courseFilter !== "all" && s.courseId !== courseFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getCourse = (id: string) => courses.find((c) => c.id === id);

  function handleResetProgress() {
    if (!selected) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id !== selected.id ? s : { ...s, progress: 0, certificateIssued: false, modules: resetModules(s.modules) }
      )
    );
  }

  function handleSkipLesson() {
    if (!selected || !skipTarget) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== selected.id) return s;
        const updated = skipLesson(s.modules, skipTarget.moduleId, skipTarget.lessonId);
        return { ...s, modules: updated, progress: calcProgress({ ...s, modules: updated }) };
      })
    );
  }

  const quizLessons = selected
    ? selected.modules.flatMap((m) => m.lessons).filter((l) => l.quizScore !== undefined)
    : [];

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
                const progress = calcProgress(s);
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
                          <div className={`h-1.5 rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8">{progress}%</span>
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
                      <button onClick={() => setSelectedId(s.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors">
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
      <Modal open={!!selected} onClose={() => setSelectedId(null)} title="Student Progress" size="lg">
        {selected && (() => {
          const progress = calcProgress(selected);
          const course = getCourse(selected.courseId);
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
                  {selected.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-brand-600">{progress}%</p>
                  <p className="text-xs text-gray-400">Overall Progress</p>
                </div>
              </div>

              {/* Admin Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Admin Controls</p>
                  <p className="text-xs text-gray-400 mt-0.5">Override student progress when they are blocked or stuck</p>
                </div>
                <button
                  className="btn-danger flex items-center gap-2 text-xs"
                  onClick={() => setConfirmReset(true)}
                >
                  <RotateCcw size={13} />
                  Reset Progress
                </button>
              </div>

              {/* Lesson Breakdown */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Lesson Breakdown</p>
                {(!course || course.modules.length === 0) && (
                  <p className="text-xs text-gray-400 px-3">No lesson data available for this course.</p>
                )}
                {course?.modules.map((mod) => {
                  const modProgress = selected.modules.find((m) => m.moduleId === mod.id);
                  return (
                    <div key={mod.id} className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 px-1">{mod.title}</p>
                      <div className="space-y-1">
                        {mod.lessons.map((lesson) => {
                          const lp = modProgress?.lessons.find((l) => l.lessonId === lesson.id);
                          const status = lp?.status ?? "not_started";
                          const canSkip = status === "not_started" || status === "in_progress";
                          return (
                            <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group">
                              <LessonStatusIcon status={status} />
                              <span className="text-xs text-gray-700 flex-1">{lesson.title}</span>
                              <span className="badge badge-draft text-xs">{lesson.type}</span>
                              {lp?.quizScore !== undefined && (
                                <span className={`text-xs font-semibold ${lp.quizScore >= 70 ? "text-emerald-600" : "text-red-500"}`}>
                                  {lp.quizScore}%
                                </span>
                              )}
                              {lp?.timeSpent !== undefined && (
                                <span className="text-xs text-gray-400">{lp.timeSpent}m</span>
                              )}
                              {status === "skipped" && (
                                <span className="text-xs text-amber-500 font-medium">Skipped</span>
                              )}
                              {canSkip && (
                                <button
                                  onClick={() => setSkipTarget({ moduleId: mod.id, lessonId: lesson.id, title: lesson.title })}
                                  className="hidden group-hover:flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-md transition-colors"
                                >
                                  <SkipForward size={11} />
                                  Skip
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quiz Scores */}
              {quizLessons.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Quiz Scores</p>
                  <div className="flex gap-2 flex-wrap">
                    {quizLessons.map((l, i) => (
                      <div key={l.lessonId} className={`text-center p-3 rounded-lg ${(l.quizScore ?? 0) >= 70 ? "bg-emerald-50" : "bg-red-50"}`}>
                        <p className={`text-lg font-bold ${(l.quizScore ?? 0) >= 70 ? "text-emerald-600" : "text-red-600"}`}>{l.quizScore}%</p>
                        <p className="text-xs text-gray-400">Quiz {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Reset Progress Confirmation */}
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleResetProgress}
        title="Reset Student Progress"
        message={`This will clear all lesson completions and quiz scores for ${selected?.name ?? "this student"}, and revoke their certificate if issued. This cannot be undone.`}
        confirmLabel="Reset Progress"
        danger
      />

      {/* Skip Lesson Confirmation */}
      <ConfirmDialog
        open={!!skipTarget}
        onClose={() => setSkipTarget(null)}
        onConfirm={() => { handleSkipLesson(); setSkipTarget(null); }}
        title="Skip Lesson"
        message={`Mark "${skipTarget?.title}" as skipped for ${selected?.name ?? "this student"}? They will be able to proceed past this step without completing it.`}
        confirmLabel="Skip Lesson"
      />

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
