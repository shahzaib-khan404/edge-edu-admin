import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useApp } from "../../context/AppContext";
import {
  BookOpen, Users, TrendingUp, CheckCircle, Plus, Send, Eye,
  Award, BarChart3, ChevronRight, ArrowUpRight, AlertCircle,
  Star, Zap, Target, Clock, HelpCircle, MessageSquare,
} from "lucide-react";
import {
  adminEnrollSparkline, adminCompletionSparkline, adminQuizSparkline, adminStudentSparkline,
  adminActivityFeed, topStudents, courseWeeklyEnrollments, skillsCompleted, adminTasks,
} from "../../data/mockData";

function Spark({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v) => ({ v }));
  return (
    <ResponsiveContainer width={72} height={28}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const FEED_META: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
  enrollment: { icon: <Users size={11} />,       bg: "bg-blue-100",    text: "text-blue-600",    label: "Enrollment"  },
  completion: { icon: <Award size={11} />,       bg: "bg-emerald-100", text: "text-emerald-600", label: "Completion"  },
  approval:   { icon: <CheckCircle size={11} />, bg: "bg-brand-100",   text: "text-brand-600",   label: "Approval"    },
  rejection:  { icon: <AlertCircle size={11} />, bg: "bg-red-100",     text: "text-red-600",     label: "Rejection"   },
  quiz:       { icon: <HelpCircle size={11} />,  bg: "bg-amber-100",   text: "text-amber-600",   label: "Quiz"        },
  milestone:  { icon: <Star size={11} />,        bg: "bg-yellow-100",  text: "text-yellow-600",  label: "Milestone"   },
};

const PRIORITY_STYLES: Record<string, string> = {
  high:   "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low:    "bg-gray-50 text-gray-500 border-gray-100",
};

export default function AdminOverview() {
  const { courses, currentUser, settings, setCourses, setNotifications } = useApp();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(adminTasks);

  const myCourses   = courses.filter((c) => c.createdBy === currentUser.id);
  const liveCourses = myCourses.filter((c) => c.status === "live");
  const draftCourses   = myCourses.filter((c) => c.status === "draft");
  const pendingCourses = myCourses.filter((c) => c.status === "pending_review");
  const rejectedCourses = myCourses.filter((c) => c.status === "draft" && c.rejectionNote);
  const totalStudents  = myCourses.reduce((s, c) => s + c.enrollments, 0);
  const avgCompletion  = Math.round(liveCourses.reduce((s, c) => s + c.completionRate, 0) / (liveCourses.length || 1));
  const avgQuiz        = Math.round(myCourses.filter((c) => c.avgQuizScore).reduce((s, c) => s + (c.avgQuizScore ?? 0), 0) / (myCourses.filter((c) => c.avgQuizScore).length || 1));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const kpiCards = [
    { label: "My Courses",      value: myCourses.length,       sub: `${liveCourses.length} published`,         spark: adminStudentSparkline,   color: "#6d28d9", up: true,  icon: BookOpen,   bg: "bg-brand-50 text-brand-600"   },
    { label: "Total Students",  value: totalStudents,           sub: "+12 enrolled this week",                  spark: adminEnrollSparkline,    color: "#3b82f6", up: true,  icon: Users,      bg: "bg-blue-50 text-blue-600"     },
    { label: "Avg Completion",  value: `${avgCompletion}%`,     sub: "+3% from last month",                     spark: adminCompletionSparkline,color: "#10b981", up: true,  icon: TrendingUp, bg: "bg-emerald-50 text-emerald-600" },
    { label: "Avg Quiz Score",  value: avgQuiz > 0 ? `${avgQuiz}%` : "—", sub: "Across all lessons",           spark: adminQuizSparkline,      color: "#f59e0b", up: true,  icon: HelpCircle, bg: "bg-amber-50 text-amber-600"   },
    { label: "Pending Review",  value: pendingCourses.length,   sub: "Awaiting SA approval",                    spark: [0,1,0,1,0,1],          color: "#f59e0b", up: false, icon: Clock,      bg: "bg-amber-50 text-amber-600"   },
    { label: "Certifications",  value: topStudents.filter((s) => s.certified).length, sub: "Issued to students", spark: adminStudentSparkline, color: "#8b5cf6", up: true,  icon: Award,      bg: "bg-purple-50 text-purple-600" },
  ];

  const publishCourse = (id: string) => {
    if (settings.approvalWorkflow) {
      setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "pending_review" } : c));
      setNotifications((p) => [{ id: `n${Date.now()}`, type: "enrollment", title: "Submitted for Review", message: "Your course has been submitted.", read: false, createdAt: new Date().toISOString() }, ...p]);
    } else {
      setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "live" } : c));
    }
  };

  const toggleTask = (id: string) => setTasks((p) => p.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const openTasks  = tasks.filter((t) => !t.done);

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#12103a] via-[#1e1a5e] to-[#0d2a4a] rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs mb-1">{today} · {currentUser.department} Department</p>
          <h2 className="text-white text-xl font-bold">{greeting}, {currentUser.name.split(" ")[0]} 👋</h2>
          <p className="text-gray-400 text-sm mt-1">
            You have <span className="text-white font-semibold">{totalStudents} students</span> across{" "}
            <span className="text-white font-semibold">{liveCourses.length} live courses</span>.
            {pendingCourses.length > 0 && <span className="text-amber-400 font-medium"> {pendingCourses.length} course awaiting SA review.</span>}
            {draftCourses.length > 0 && <span className="text-gray-300"> {draftCourses.length} draft{draftCourses.length > 1 ? "s" : ""} ready to publish.</span>}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-primary py-2 text-xs" onClick={() => navigate("/admin/courses")}>
            <Plus size={13} />Create Course
          </button>
          <button className="border border-white/20 text-white hover:bg-white/10 font-medium px-3 py-2 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5" onClick={() => navigate("/admin/analytics")}>
            <BarChart3 size={13} />View Analytics
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        {kpiCards.map((k) => (
          <div key={k.label} className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <div className={`p-1.5 rounded-lg ${k.bg}`}><k.icon size={14} /></div>
              <Spark data={k.spark} color={k.color} />
            </div>
            <p className="text-xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5">{k.label}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={11} className={k.up ? "text-emerald-500" : "text-amber-500"} />
              <p className={`text-xs ${k.up ? "text-emerald-500" : "text-amber-500"}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Alert */}
      {rejectedCourses.length > 0 && (
        <div className="card border-l-4 border-l-red-400 overflow-hidden">
          <div className="px-5 py-3 bg-red-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-red-500" />
              <p className="text-sm font-semibold text-red-800">
                {rejectedCourses.length} Course{rejectedCourses.length > 1 ? "s" : ""} Returned for Revision
              </p>
            </div>
            <button onClick={() => navigate("/admin/courses")} className="text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
              View & fix <ChevronRight size={12} />
            </button>
          </div>
          {rejectedCourses.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3 border-t border-red-50">
              <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                <p className="text-xs text-red-600 mt-0.5">
                  <span className="font-semibold">SA Note:</span> {c.rejectionNote}
                </p>
              </div>
              <button onClick={() => navigate("/admin/courses")} className="btn-secondary py-1.5 px-3 text-xs gap-1 shrink-0">
                <Eye size={11} />Edit Course
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Draft Courses Ready to Publish */}
      {draftCourses.filter((c) => !c.rejectionNote).length > 0 && (
        <div className="card border-l-4 border-l-brand-400 overflow-hidden">
          <div className="px-5 py-3 bg-brand-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-brand-600" />
              <p className="text-sm font-semibold text-brand-800">
                {draftCourses.filter((c) => !c.rejectionNote).length} Draft{draftCourses.filter((c) => !c.rejectionNote).length > 1 ? "s" : ""} Ready to Publish
              </p>
            </div>
          </div>
          {draftCourses.filter((c) => !c.rejectionNote).map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3 border-t border-brand-50/60">
              <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                <p className="text-xs text-gray-400">{c.modules.length} modules · Created {c.createdAt}</p>
              </div>
              <button onClick={() => publishCourse(c.id)} className="btn-primary py-1.5 px-3 text-xs gap-1 shrink-0">
                <Send size={11} />{settings.approvalWorkflow ? "Submit for Review" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main grid: Activity + Sidebar */}
      <div className="grid grid-cols-3 gap-5">

        {/* Activity Feed */}
        <div className="card col-span-2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="section-title">Activity Feed</p>
            <span className="badge badge-live text-xs">Live</span>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto" style={{ maxHeight: 360 }}>
            {adminActivityFeed.map((item) => {
              const meta = FEED_META[item.type] ?? FEED_META.enrollment;
              return (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${meta.bg} ${meta.text}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{item.actor}</span>
                      {" "}{item.action}
                      {item.target && <> <span className="text-brand-600 font-medium">"{item.target}"</span></>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                  <span className={`badge text-xs shrink-0 border ${PRIORITY_STYLES.low} hidden`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Quick Actions + Tasks */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="card p-4">
            <p className="section-title mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button className="btn-primary w-full justify-center text-xs py-2" onClick={() => navigate("/admin/courses")}>
                <Plus size={13} />Create New Course
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/admin/students")}>
                <Users size={13} />View My Students
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/admin/analytics")}>
                <BarChart3 size={13} />Course Analytics
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/admin/analytics")}>
                <MessageSquare size={13} />Notifications
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title">My Tasks</p>
              {openTasks.length > 0 && (
                <span className="badge badge-pending text-xs">{openTasks.length} open</span>
              )}
            </div>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} onClick={() => toggleTask(t.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${t.done ? "bg-gray-50 border-gray-100 opacity-50" : `border ${PRIORITY_STYLES[t.priority]}`}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${t.done ? "bg-emerald-500 border-emerald-500" : "border-current"}`}>
                    {t.done && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-tight ${t.done ? "line-through text-gray-400" : "text-gray-800"}`}>{t.label}</p>
                    {!t.done && <span className="text-xs capitalize opacity-70 mt-0.5 block">{t.priority} priority</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Enrollment Trend */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title">Weekly Enrollment Trend</p>
            <p className="text-xs text-gray-400 mt-0.5">New students joining your courses each week</p>
          </div>
          <button onClick={() => navigate("/admin/analytics")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Full analytics <ChevronRight size={12} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={courseWeeklyEnrollments}>
            <defs>
              <linearGradient id="cr1Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cr2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
            <Area type="monotone" dataKey="cr1" name="Clinical Assessment" stroke="#6d28d9" strokeWidth={2} fill="url(#cr1Grad)" dot={{ r: 3, fill: "#6d28d9" }} />
            <Area type="monotone" dataKey="cr2" name="AI in Healthcare" stroke="#10b981" strokeWidth={2} fill="url(#cr2Grad)" dot={{ r: 3, fill: "#10b981" }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand-600" /><span className="text-xs text-gray-500">Advanced Clinical Assessment</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-gray-500">AI in Healthcare</span></div>
        </div>
      </div>

      {/* Course Health + Top Students */}
      <div className="grid grid-cols-2 gap-5">

        {/* Course Health Cards */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Course Health</p>
            <button onClick={() => navigate("/admin/courses")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Manage <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {myCourses.map((c) => (
              <div key={c.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge-${c.status === "live" ? "live" : c.status === "pending_review" ? "pending" : "draft"} text-xs`}>
                        {c.status === "pending_review" ? "Pending" : c.status}
                      </span>
                      <span className="text-xs text-gray-400">{c.enrollments} students</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Completion", value: c.enrollments > 0 ? `${c.completionRate}%` : "—", bar: c.completionRate, color: c.completionRate > 70 ? "#10b981" : "#f59e0b" },
                    { label: "Quiz Avg",   value: c.avgQuizScore ? `${c.avgQuizScore}%` : "—",      bar: c.avgQuizScore ?? 0, color: (c.avgQuizScore ?? 0) > 75 ? "#6d28d9" : "#f59e0b" },
                    { label: "Modules",    value: `${c.modules.length}`,                            bar: Math.min(100, c.modules.length * 20), color: "#3b82f6" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{m.label}</span>
                        <span className="text-xs font-bold text-gray-700">{m.value}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${m.bar}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Top Students</p>
            <button onClick={() => navigate("/admin/students")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              All students <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-base w-5 shrink-0">{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-900">{s.name}</p>
                    {s.certified && <Award size={11} className="text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{s.courseTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-14 bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${s.progress === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-7">{s.progress}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Quiz: {s.quizAvg}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Completion */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title">Skills Being Completed</p>
            <p className="text-xs text-gray-400 mt-0.5">How many students have fully completed each skill tag in your courses</p>
          </div>
          <Target size={16} className="text-gray-300" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {skillsCompleted.map((s) => (
            <div key={s.skill} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Target size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-800">{s.skill}</p>
                  <span className="text-xs font-bold text-brand-600 ml-2 shrink-0">{s.completions} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{s.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
