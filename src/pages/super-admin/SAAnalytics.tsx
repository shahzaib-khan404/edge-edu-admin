import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, Legend,
} from "recharts";
import { useApp } from "../../context/AppContext";
import {
  enrollmentOverTime, completionFunnel, adminPerformance, userGrowth,
  categoryDistribution, skillsEnrollment, lessonDropoffSA, quizScoresPerCourse,
  activeLearnersData,
} from "../../data/mockData";
import {
  TrendingUp, Users, BookOpen, Award, BarChart2, Activity,
  ChevronDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

type Range = "7d" | "30d" | "90d" | "all";

const BRAND_COLORS = ["#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const CustomTooltipStyle = {
  contentStyle: { fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
};

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <p className="section-title">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function KpiCard({ label, value, change, positive, icon: Icon, color }: {
  label: string; value: string | number; change: string; positive?: boolean; icon: any; color: string;
}) {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <div className={`p-2 rounded-lg ${color}`}><Icon size={16} /></div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-1">
        {positive !== undefined && (
          positive
            ? <ArrowUpRight size={12} className="text-emerald-500" />
            : <ArrowDownRight size={12} className="text-red-400" />
        )}
        <p className={`text-xs font-medium ${positive === true ? "text-emerald-500" : positive === false ? "text-red-400" : "text-gray-400"}`}>
          {change}
        </p>
      </div>
    </div>
  );
}

export default function SAAnalytics() {
  const { courses, users } = useApp();
  const [range, setRange] = useState<Range>("30d");
  const [deptFilter, setDeptFilter] = useState("all");

  const liveCourses = courses.filter((c) => c.status === "live");
  const totalEnrollments = courses.reduce((s, c) => s + c.enrollments, 0);
  const avgCompletion = Math.round(liveCourses.reduce((s, c) => s + c.completionRate, 0) / (liveCourses.length || 1));
  const avgQuiz = Math.round(courses.filter((c) => c.avgQuizScore).reduce((s, c) => s + (c.avgQuizScore ?? 0), 0) / (courses.filter((c) => c.avgQuizScore).length || 1));
  const activeUsers = users.filter((u) => u.status === "active").length;

  const topCourses = [...courses].sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);
  const lowCompletion = [...liveCourses].sort((a, b) => a.completionRate - b.completionRate).slice(0, 5);

  const filteredAdmins = deptFilter === "all"
    ? adminPerformance
    : adminPerformance.filter((a) => a.dept.toLowerCase().includes(deptFilter.toLowerCase()));

  const rangeSlice = (data: any[]) => {
    if (range === "7d") return data.slice(-2);
    if (range === "30d") return data.slice(-3);
    if (range === "90d") return data.slice(-5);
    return data;
  };

  return (
    <div className="space-y-6">
      {/* Date range + title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Platform Analytics</h2>
          <p className="text-xs text-gray-400 mt-0.5">All departments · Real-time data</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {(["7d", "30d", "90d", "all"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${range === r ? "bg-brand-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {r === "all" ? "All time" : r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row — 6 cards */}
      <div className="grid grid-cols-6 gap-3">
        <KpiCard label="Total Enrollments" value={totalEnrollments.toLocaleString()} change="+18% this month" positive icon={TrendingUp} color="bg-brand-50 text-brand-600" />
        <KpiCard label="Active Learners" value={activeUsers} change="+12% this month" positive icon={Activity} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Avg Completion" value={`${avgCompletion}%`} change="+3% vs last month" positive icon={Award} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Avg Quiz Score" value={`${avgQuiz}%`} change="Across all courses" icon={BarChart2} color="bg-amber-50 text-amber-600" />
        <KpiCard label="Published Courses" value={liveCourses.length} change={`${courses.filter((c) => c.status === "pending_review").length} pending review`} icon={BookOpen} color="bg-purple-50 text-purple-600" />
        <KpiCard label="Total Users" value={users.length} change={`${users.filter((u) => u.role === "admin").length} admins`} icon={Users} color="bg-pink-50 text-pink-600" />
      </div>

      {/* Row 1: Enrollment + User Growth */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Enrollments Over Time" subtitle="Total new enrollments per month" />
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={rangeSlice(enrollmentOverTime)}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...CustomTooltipStyle} />
              <Area type="monotone" dataKey="enrollments" stroke="#6d28d9" strokeWidth={2.5} fill="url(#enrollGrad)" dot={{ fill: "#6d28d9", r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="User Growth" subtitle="New vs returning learners" />
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={rangeSlice(userGrowth)} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...CustomTooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="newUsers" name="New Users" fill="#6d28d9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returning" name="Returning" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Completion Funnel + Active Learners weekly */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Completion Funnel" subtitle="Enrolled → Started → Completed" />
          <div className="space-y-3 mt-2">
            {completionFunnel.map((s, i) => {
              const pct = Math.round((s.count / completionFunnel[0].count) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{s.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{s.count.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: BRAND_COLORS[i] }}
                    />
                  </div>
                  {i < completionFunnel.length - 1 && (
                    <p className="text-xs text-red-400 mt-0.5 text-right">
                      −{completionFunnel[i].count - completionFunnel[i + 1].count} dropped off
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Active Learners (Weekly)" subtitle="Students who logged in and watched a lesson" />
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={activeLearnersData}>
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...CustomTooltipStyle} />
              <Area type="monotone" dataKey="active" name="Active Learners" stroke="#10b981" strokeWidth={2.5} fill="url(#activeGrad)" dot={{ fill: "#10b981", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Admin Performance (with dept filter + sort) */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Admin Performance Breakdown" />
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="select pr-7 text-sm appearance-none" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="all">All Departments</option>
                <option value="Healthcare">Healthcare</option>
                <option value="AI">AI & Tech</option>
                <option value="Compliance">Compliance</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header text-left">Admin</th>
                <th className="table-header text-left">Department</th>
                <th className="table-header text-right">Courses</th>
                <th className="table-header text-right">Students</th>
                <th className="table-header text-right">Avg Quiz</th>
                <th className="table-header text-right">Avg Completion</th>
                <th className="table-header text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((a, i) => (
                <tr key={a.name} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      {i === 0 && <span className="text-base">🥇</span>}
                      {i === 1 && <span className="text-base">🥈</span>}
                      {i === 2 && <span className="text-base">🥉</span>}
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                        {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{a.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-draft">{a.dept}</span>
                  </td>
                  <td className="table-cell text-right font-medium">{a.courses}</td>
                  <td className="table-cell text-right font-medium">{a.students.toLocaleString()}</td>
                  <td className="table-cell text-right font-semibold">
                    <span className={a.avgQuiz >= 80 ? "text-emerald-600" : a.avgQuiz >= 60 ? "text-amber-500" : "text-gray-400"}>
                      {a.avgQuiz > 0 ? `${a.avgQuiz}%` : "—"}
                    </span>
                  </td>
                  <td className="table-cell text-right font-semibold text-brand-600">{a.completion > 0 ? `${a.completion}%` : "—"}</td>
                  <td className="table-cell w-44">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${a.completion}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Course Metrics — Top + Lowest + Quiz Scores */}
      <div className="grid grid-cols-3 gap-5">
        <div className="card p-5">
          <SectionHeader title="Top Courses" subtitle="By enrollment count" />
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-gray-400 w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{c.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ background: BRAND_COLORS[i], width: `${Math.min(100, (c.enrollments / 400) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 font-medium">{c.enrollments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Lowest Completion" subtitle="Courses needing attention" />
          <div className="space-y-3">
            {lowCompletion.map((c) => (
              <div key={c.id} className="flex items-center gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{c.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${c.completionRate < 50 ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${c.completionRate}%` }} />
                    </div>
                    <span className={`text-xs font-semibold shrink-0 ${c.completionRate < 50 ? "text-red-500" : "text-amber-500"}`}>{c.completionRate}%</span>
                  </div>
                </div>
                {c.completionRate < 50 && <span className="text-red-400 shrink-0">⚠</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Avg Quiz Score" subtitle="Per course · Pass threshold 70%" />
          <div className="space-y-3">
            {quizScoresPerCourse.map((q) => (
              <div key={q.course}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-gray-700 truncate">{q.course}</p>
                  <span className={`text-xs font-bold ml-2 shrink-0 ${q.avgScore >= 70 ? "text-emerald-600" : q.avgScore > 0 ? "text-red-500" : "text-gray-300"}`}>
                    {q.avgScore > 0 ? `${q.avgScore}%` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${q.avgScore >= 70 ? "bg-emerald-500" : q.avgScore > 0 ? "bg-red-400" : "bg-gray-200"}`} style={{ width: `${q.avgScore}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 w-12 text-right">{q.attempts > 0 ? `${q.passRate}% pass` : "no data"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 6: Lesson Drop-off Heatmap */}
      <div className="card p-5">
        <SectionHeader title="Lesson Drop-off Heatmap" subtitle="% of enrolled students who watched each lesson — Advanced Clinical Assessment" />
        <div className="flex gap-3 items-end mt-4">
          {lessonDropoffSA.map((l, i) => (
            <div key={l.lesson} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-gray-600">{l.pct}%</span>
              <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: 120 }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all"
                  style={{
                    height: `${l.pct}%`,
                    background: l.pct > 70 ? "#6d28d9" : l.pct > 50 ? "#f59e0b" : "#ef4444",
                    opacity: 0.85 + i * 0.02,
                  }}
                />
                <div className="absolute inset-0 bg-gray-100 rounded-t-lg -z-10" />
              </div>
              <span className="text-xs text-gray-500 text-center leading-tight">{l.lesson}</span>
              {i < lessonDropoffSA.length - 1 && lessonDropoffSA[i].pct - lessonDropoffSA[i + 1].pct > 12 && (
                <span className="text-xs text-red-400 font-semibold">−{lessonDropoffSA[i].pct - lessonDropoffSA[i + 1].pct}%</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-600" /><span className="text-xs text-gray-500">Good (&gt;70%)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-xs text-gray-500">At risk (50–70%)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-400" /><span className="text-xs text-gray-500">Drop-off (&lt;50%)</span></div>
        </div>
      </div>

      {/* Row 7: Skills & Categories Report */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionHeader title="Most-Enrolled Skills" subtitle="Across all published courses" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillsEnrollment} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 10 }} width={110} />
              <Tooltip {...CustomTooltipStyle} />
              <Bar dataKey="enrollments" name="Enrollments" radius={[0, 4, 4, 0]}>
                {skillsEnrollment.map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[Math.min(i, BRAND_COLORS.length - 1)]} opacity={1 - i * 0.07} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <SectionHeader title="Category Distribution" subtitle="Published courses by category" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistribution.filter((c) => c.enrollments > 0)}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={3}
                  dataKey="enrollments"
                >
                  {categoryDistribution.filter((c) => c.enrollments > 0).map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip {...CustomTooltipStyle} formatter={(v) => [Number(v), "Enrollments"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {categoryDistribution.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-gray-700 flex-1">{c.name}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900">{c.enrollments}</span>
                    <span className="text-xs text-gray-400 ml-1">({c.courses} courses)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
