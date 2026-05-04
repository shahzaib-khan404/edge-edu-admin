import { useState } from "react";
import { Plus, X, GripVertical, ChevronRight, ChevronLeft, Check, Upload, Video, FileText, HelpCircle, File, Cpu } from "lucide-react";
import type { Course, Module, Lesson } from "../../types";
import { useApp } from "../../context/AppContext";

interface Props {
  course?: Course;
  onClose: () => void;
  onSave: (c: Course) => void;
  isSuperAdmin?: boolean;
}

const STEPS = ["Thumbnail & Basic Info", "Metadata", "Learning Outcomes", "Visibility & Options", "Modules & Lessons"];
const LESSON_TYPES = [
  { type: "video", label: "Video", icon: Video },
  { type: "quiz", label: "Quiz", icon: HelpCircle },
  { type: "text", label: "Text", icon: FileText },
  { type: "document", label: "Document", icon: File },
  { type: "scenario", label: "Scenario", icon: Cpu },
] as const;

export default function CourseWizard({ course, onClose, onSave, isSuperAdmin }: Props) {
  const { categories, badges, instructors, languages, skills, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Course>>({
    title: "", subtitle: "", description: "", about: "",
    category: "", badge: "", instructor: "", language: "", totalHours: "",
    skills: [], whatYoullLearn: [], courseIncludes: [], modules: [],
    isFeatured: false, isTrending: false, isTopCourse: false, isWebinar: false,
    isComingSoon: false, hasCertificate: false,
    ...course,
  });
  const [newLearnItem, setNewLearnItem] = useState("");
  const [newIncludesItem, setNewIncludesItem] = useState("");
  const [addingModuleLesson, setAddingModuleLesson] = useState<{ moduleId: string } | null>(null);
  const [newLessonForm, setNewLessonForm] = useState({ title: "", type: "video" as Lesson["type"] });

  const set = (k: keyof Course, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const addLearnItem = () => {
    if (!newLearnItem.trim()) return;
    set("whatYoullLearn", [...(form.whatYoullLearn ?? []), newLearnItem.trim()]);
    setNewLearnItem("");
  };

  const addIncludesItem = () => {
    if (!newIncludesItem.trim()) return;
    set("courseIncludes", [...(form.courseIncludes ?? []), newIncludesItem.trim()]);
    setNewIncludesItem("");
  };

  const addModule = () => {
    const mod: Module = { id: `m${Date.now()}`, title: "New Module", description: "", lessons: [], order: (form.modules?.length ?? 0) + 1 };
    set("modules", [...(form.modules ?? []), mod]);
  };

  const updateModule = (id: string, title: string) => {
    set("modules", (form.modules ?? []).map((m) => m.id === id ? { ...m, title } : m));
  };

  const removeModule = (id: string) => {
    set("modules", (form.modules ?? []).filter((m) => m.id !== id));
  };

  const addLesson = (moduleId: string) => {
    if (!newLessonForm.title.trim()) return;
    const lesson: Lesson = { id: `ls${Date.now()}`, title: newLessonForm.title, type: newLessonForm.type };
    set("modules", (form.modules ?? []).map((m) => m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m));
    setNewLessonForm({ title: "", type: "video" });
    setAddingModuleLesson(null);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    set("modules", (form.modules ?? []).map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m));
  };

  const handleSave = () => {
    const saved: Course = {
      id: course?.id ?? `cr${Date.now()}`,
      title: form.title ?? "",
      subtitle: form.subtitle,
      description: form.description,
      about: form.about,
      thumbnail: form.thumbnail,
      status: course?.status ?? "draft",
      createdBy: course?.createdBy ?? currentUser.id,
      department: currentUser.department,
      category: form.category,
      badge: form.badge,
      instructor: form.instructor,
      language: form.language,
      totalHours: form.totalHours,
      skills: form.skills ?? [],
      whatYoullLearn: form.whatYoullLearn ?? [],
      courseIncludes: form.courseIncludes ?? [],
      modules: form.modules ?? [],
      enrollments: course?.enrollments ?? 0,
      completionRate: course?.completionRate ?? 0,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isTopCourse: form.isTopCourse,
      isWebinar: form.isWebinar,
      isComingSoon: form.isComingSoon,
      hasCertificate: form.hasCertificate,
      createdAt: course?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    onSave(saved);
  };

  const lessonTypeIcon = (type: Lesson["type"]) => {
    const found = LESSON_TYPES.find((x) => x.type === type);
    return found ? <found.icon size={12} /> : null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
          <div>
            <h2 className="font-bold text-gray-900">{course ? "Edit Course" : "Create New Course"}</h2>
            <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((_s, i) => (
            <div key={i} className="flex items-center gap-1">
              <button onClick={() => setStep(i)} className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </button>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-5">

          {step === 0 && (
            <>
              <div>
                <label className="label">Course Thumbnail</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-300 transition-colors">
                  {form.thumbnail ? (
                    <img src={form.thumbnail} alt="" className="w-full h-40 object-cover rounded-lg" />
                  ) : (
                    <div className="text-gray-400">
                      <Upload size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Click to upload thumbnail</p>
                      <p className="text-xs mt-1">PNG, JPG up to 5MB · Recommended: 1280×720</p>
                    </div>
                  )}
                </div>
                <input className="input mt-2" placeholder="Or paste image URL…" value={form.thumbnail ?? ""} onChange={(e) => set("thumbnail", e.target.value)} />
              </div>
              <div><label className="label">Title <span className="text-red-400">*</span></label><input className="input" placeholder="Course title" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
              <div><label className="label">Subtitle</label><input className="input" placeholder="Short tagline" value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></div>
              <div><label className="label">Description</label><textarea className="input" rows={3} placeholder="Shown in course preview…" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
              <div><label className="label">About (Detailed)</label><textarea className="input" rows={4} placeholder="Shown on the full public course page…" value={form.about ?? ""} onChange={(e) => set("about", e.target.value)} /></div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
                Orange fields are select-only. Contact Super Admin to add new options to the Library.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-amber-700">Category</label>
                  <select className="select border-amber-200" value={form.category ?? ""} onChange={(e) => set("category", e.target.value)}>
                    <option value="">— select —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label text-amber-700">Badge / Certificate</label>
                  <select className="select border-amber-200" value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)}>
                    <option value="">— select —</option>
                    {badges.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label text-amber-700">Instructor</label>
                  <select className="select border-amber-200" value={form.instructor ?? ""} onChange={(e) => set("instructor", e.target.value)}>
                    <option value="">— select —</option>
                    {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label text-amber-700">Language</label>
                  <select className="select border-amber-200" value={form.language ?? ""} onChange={(e) => set("language", e.target.value)}>
                    <option value="">— select —</option>
                    {languages.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Total Hours</label>
                <input className="input" placeholder="e.g. 24" value={form.totalHours ?? ""} onChange={(e) => set("totalHours", e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="label">What You'll Learn</label>
                <div className="space-y-2 mb-2">
                  {(form.whatYoullLearn ?? []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Check size={12} className="text-emerald-500 shrink-0" />
                      <span className="text-sm flex-1">{item}</span>
                      <button onClick={() => set("whatYoullLearn", (form.whatYoullLearn ?? []).filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="Add learning outcome…" value={newLearnItem} onChange={(e) => setNewLearnItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLearnItem()} />
                  <button className="btn-secondary" onClick={addLearnItem}><Plus size={14} /></button>
                </div>
              </div>

              <div>
                <label className="label text-amber-700">Skills You'll Gain (multi-select from Library)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.skills ?? []).map((sid) => {
                    const sk = skills.find((s) => s.id === sid);
                    return sk ? (
                      <span key={sid} className="badge badge-pending flex items-center gap-1">
                        {sk.name} <button onClick={() => set("skills", (form.skills ?? []).filter((s) => s !== sid))}><X size={10} /></button>
                      </span>
                    ) : null;
                  })}
                </div>
                <select className="select border-amber-200" onChange={(e) => { if (e.target.value && !(form.skills ?? []).includes(e.target.value)) set("skills", [...(form.skills ?? []), e.target.value]); e.target.value = ""; }}>
                  <option value="">+ Add skill…</option>
                  {skills.filter((s) => !(form.skills ?? []).includes(s.id)).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="label">This Course Includes</label>
                <div className="space-y-2 mb-2">
                  {(form.courseIncludes ?? []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm flex-1">{item}</span>
                      <button onClick={() => set("courseIncludes", (form.courseIncludes ?? []).filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="e.g. 57 lectures with quizzes" value={newIncludesItem} onChange={(e) => setNewIncludesItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addIncludesItem()} />
                  <button className="btn-secondary" onClick={addIncludesItem}><Plus size={14} /></button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {[
                { key: "hasCertificate", label: "Award Certificate on Completion", desc: "Students receive a certificate when they finish the course" },
                { key: "isTopCourse", label: "Top Course", desc: "Show in the Top Courses section" },
                { key: "isTrending", label: "Trending", desc: "Show in the Trending section" },
                { key: "isWebinar", label: "Webinar", desc: "Show in Upcoming Webinars section" },
                { key: "isComingSoon", label: "Coming Soon", desc: "Show blurred thumbnail preview" },
                ...(isSuperAdmin ? [{ key: "isFeatured", label: "⭐ Featured (SA only)", desc: "Pin to featured section — Super Admin only", saOnly: true }] : []),
              ].map(({ key, label, desc, saOnly }) => (
                <div key={key} className={`flex items-center justify-between p-4 border rounded-xl ${saOnly ? "border-brand-200 bg-brand-50" : "border-gray-100"}`}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => set(key as keyof Course, !(form as any)[key])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${(form as any)[key] ? "bg-brand-600" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(form as any)[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="section-title">Modules ({form.modules?.length ?? 0})</p>
                <button className="btn-secondary" onClick={addModule}><Plus size={14} />Add Module</button>
              </div>

              {(form.modules ?? []).map((mod) => (
                <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <GripVertical size={14} className="text-gray-300 cursor-grab" />
                    <input
                      className="flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none"
                      value={mod.title}
                      onChange={(e) => updateModule(mod.id, e.target.value)}
                    />
                    <button onClick={() => removeModule(mod.id)} className="p-1 rounded hover:bg-gray-200 text-gray-400"><X size={12} /></button>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-2 py-1.5 px-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-gray-400">{lessonTypeIcon(lesson.type)}</span>
                        <span className="text-xs font-medium text-gray-700 flex-1">{lesson.title}</span>
                        <span className="badge badge-draft text-xs">{lesson.type}</span>
                        <button onClick={() => removeLesson(mod.id, lesson.id)} className="text-gray-300 hover:text-red-400"><X size={11} /></button>
                      </div>
                    ))}

                    {addingModuleLesson?.moduleId === mod.id ? (
                      <div className="flex gap-2 items-center pt-1">
                        <input className="input flex-1 text-xs" placeholder="Lesson title…" value={newLessonForm.title} onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addLesson(mod.id)} autoFocus />
                        <select className="select text-xs w-28" value={newLessonForm.type} onChange={(e) => setNewLessonForm({ ...newLessonForm, type: e.target.value as Lesson["type"] })}>
                          {LESSON_TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
                        </select>
                        <button className="btn-primary py-1 px-2 text-xs" onClick={() => addLesson(mod.id)}>Add</button>
                        <button className="btn-secondary py-1 px-2 text-xs" onClick={() => setAddingModuleLesson(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingModuleLesson({ moduleId: mod.id })} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium py-1">
                        <Plus size={12} />Add Lesson
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {(form.modules ?? []).length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-400">No modules yet. Add your first module to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <button className="btn-secondary" onClick={step > 0 ? () => setStep(step - 1) : onClose}>
          <ChevronLeft size={14} />{step === 0 ? "Cancel" : "Back"}
        </button>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={handleSave}>Save as Draft</button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={step === 0 && !form.title}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSave}>
              <Check size={14} />Create Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
