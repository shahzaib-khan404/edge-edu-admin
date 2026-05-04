import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { useApp } from "../../context/AppContext";
import {
  BookOpen, Users, TrendingUp, Clock, Plus, UserPlus, CheckCircle,
  XCircle, ArrowUpRight, Award, Activity, ChevronRight, Eye,
  Layers, Globe, Mail, HardDrive, Bell, AlertTriangle,
} from "lucide-react";
import {
  enrollmentSparkline, userSparkline, completionSparkline, pendingSparkline,
  departmentStats, activityFeed, adminPerformance,
} from "../../data/mockData";

// Tiny sparkline component
function Spark({ data, color }: { data: number[]; color: string; up: boolean }) {
  const points = data.map((v) => ({ v }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const ACTIVITY_ICONS: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  enrollment: { icon: <Users size={12} />,     bg: "bg-blue-100",    text: "text-blue-600"    },
  submit:     { icon: <Clock size={12} />,     bg: "bg-amber-100",   text: "text-amber-600"   },
  completion: { icon: <Award size={12} />,     bg: "bg-emerald-100", text: "text-emerald-600" },
  new_admin:  { icon: <UserPlus size={12} />,  bg: "bg-brand-100",   text: "text-brand-600"   },
  publish:    { icon: <Globe size={12} />,     bg: "bg-purple-100",  text: "text-purple-600"  },
  new_user:   { icon: <Activity size={12} />,  bg: "bg-gray-100",    text: "text-gray-500"    },
};

export default function SAOverview() {
  const { courses, users, setCourses, currentUser, settings } = useApp();
  const navigate = useNavigate();
  const [, setApprovingId] = useState<string | null>(null);

  // Derived stats
  const totalEnrollments = courses.reduce((s, c) => s + c.enrollments, 0);
  const liveCourses      = courses.filter((c) => c.status === "live");
  const pendingCourses   = courses.filter((c) => c.status === "pending_review");
  const avgCompletion    = Math.round(liveCourses.reduce((s, c) => s + c.completionRate, 0) / (liveCourses.length || 1));
  const activeAdmins     = users.filter((u) => u.role === "admin" && u.status === "active");
  const admins           = users.filter((u) => u.role === "admin");
  const topCourses       = [...liveCourses].sort((a, b) => b.enrollments - a.enrollments).slice(0, 4);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const kpiCards = [
    { label: "Total Enrollments",  value: totalEnrollments.toLocaleString(), sub: "+18% this month",    spark: enrollmentSparkline,  color: "#6d28d9", up: true,  icon: TrendingUp, iconBg: "bg-brand-50 text-brand-600"   },
    { label: "Total Users",        value: users.length,                      sub: `${activeAdmins.length} active admins`, spark: userSparkline, color: "#3b82f6", up: true, icon: Users, iconBg: "bg-blue-50 text-blue-600" },
    { label: "Avg Completion Rate",value: `${avgCompletion}%`,               sub: "+3% vs last month",  spark: completionSparkline,  color: "#10b981", up: true,  icon: Award,      iconBg: "bg-emerald-50 text-emerald-600" },
    { label: "Live Courses",       value: liveCourses.length,                sub: `${courses.length} total`,         spark: userSparkline, color: "#8b5cf6", up: true,  icon: BookOpen,   iconBg: "bg-purple-50 text-purple-600"   },
    { label: "Pending Review",     value: pendingCourses.length,             sub: "awaiting approval",  spark: pendingSparkline,     color: "#f59e0b", up: false, icon: Clock,      iconBg: "bg-amber-50 text-amber-600"     },
    { label: "Active Learners",    value: users.filter((u) => u.status === "active" && u.role === "user").length, sub: "this month", spark: enrollmentSparkline, color: "#06b6d4", up: true, icon: Activity, iconBg: "bg-cyan-50 text-cyan-600" },
  ];

  const handleApprove = (id: string) => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "live" } : c));
    setApprovingId(null);
  };

  const handleReject = (id: string) => {
    setCourses((p) => p.map((c) => c.id === id ? { ...c, status: "draft", rejectionNote: "Please review and resubmit." } : c));
    setApprovingId(null);
  };

  const integrations = [
    { name: "AWS S3",     status: "operational", icon: HardDrive },
    { name: "SuprSend",   status: "operational", icon: Mail      },
    { name: "LocalStack", status: "operational", icon: Layers    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#12103a] to-[#1e1a5e] rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">{today}</p>
          <h2 className="text-white text-xl font-bold">{greeting}, {currentUser.name.split(" ")[0]} 👋</h2>
          <p className="text-gray-400 text-sm mt-1">
            {pendingCourses.length > 0
              ? <span className="text-amber-400 font-medium">{pendingCourses.length} course{pendingCourses.length > 1 ? "s" : ""} pending your review.</span>
              : <span className="text-emerald-400 font-medium">All courses are up to date.</span>
            }
            {" "}Platform is running smoothly.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {pendingCourses.length > 0 && (
            <button className="btn-primary py-2 text-xs" onClick={() => navigate("/sa/courses")}>
              <CheckCircle size={13} />Review Queue ({pendingCourses.length})
            </button>
          )}
          <button className="border border-white/20 text-white hover:bg-white/10 font-medium px-3 py-2 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5" onClick={() => navigate("/sa/analytics")}>
            <TrendingUp size={13} />View Analytics
          </button>
        </div>
      </div>

      {/* 6 KPI Cards with sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <div className={`p-1.5 rounded-lg ${k.iconBg}`}><k.icon size={14} /></div>
              <Spark data={k.spark} color={k.color} up={k.up} />
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

      {/* Pending Approval Inline Panel */}
      {pendingCourses.length > 0 && (
        <div className="card border-l-4 border-l-amber-400 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">
                {pendingCourses.length} Course{pendingCourses.length > 1 ? "s" : ""} Awaiting Approval
              </p>
            </div>
            <button onClick={() => navigate("/sa/courses")} className="text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1">
              View all in queue <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingCourses.slice(0, 3).map((c) => {
              const admin = users.find((u) => u.id === c.createdBy);
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400">
                      By {admin?.name ?? "—"} · {c.department} · Submitted {c.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => navigate("/sa/courses")} className="btn-secondary py-1 px-2.5 text-xs gap-1">
                      <Eye size={11} />Preview
                    </button>
                    <button onClick={() => handleApprove(c.id)} className="btn-primary py-1 px-2.5 text-xs gap-1">
                      <CheckCircle size={11} />Approve
                    </button>
                    <button onClick={() => handleReject(c.id)} className="btn-danger py-1 px-2.5 text-xs gap-1">
                      <XCircle size={11} />Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main grid: Activity feed + Right column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Activity Feed */}
        <div className="card col-span-2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="section-title">Activity Feed</p>
            <span className="badge badge-live text-xs">Live</span>
          </div>
          <div className="flex-1 divide-y divide-gray-50 overflow-y-auto" style={{ maxHeight: 380 }}>
            {activityFeed.map((item) => {
              const meta = ACTIVITY_ICONS[item.type] ?? ACTIVITY_ICONS.new_user;
              return (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${meta.bg} ${meta.text}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{item.actor}</span>
                      {" "}{item.action}{item.target && <> <span className="text-brand-600 font-medium">"{item.target}"</span></>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-400">{item.time}</p>
                      {item.dept && (
                        <><span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{item.dept}</span></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="card p-4">
            <p className="section-title mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button className="btn-primary w-full justify-center text-xs py-2" onClick={() => navigate("/sa/courses")}>
                <CheckCircle size={13} />Approve Pending Courses
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/sa/users")}>
                <UserPlus size={13} />Invite New Admin
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/sa/library")}>
                <Plus size={13} />Add Skill / Category
              </button>
              <button className="btn-secondary w-full justify-center text-xs py-2" onClick={() => navigate("/sa/analytics")}>
                <TrendingUp size={13} />View Full Analytics
              </button>
            </div>
          </div>

          {/* Platform Health */}
          <div className="card p-4">
            <p className="section-title mb-3">Platform Health</p>
            <div className="space-y-2.5">
              {integrations.map((i) => (
                <div key={i.name} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <i.icon size={13} className="text-gray-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 flex-1">{i.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">Operational</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Bell size={13} className="text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-700 flex-1">Approval Workflow</span>
                <span className={`text-xs font-semibold ${settings.approvalWorkflow ? "text-brand-600" : "text-gray-400"}`}>
                  {settings.approvalWorkflow ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title">Department Performance</p>
          <button onClick={() => navigate("/sa/analytics")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Full report <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {departmentStats.map((d) => (
            <div key={d.name} className={`card p-4 border ${d.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <p className="text-sm font-semibold text-gray-900">{d.name}</p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Courses</span>
                  <span className="text-xs font-bold text-gray-900">{d.courses} <span className="text-gray-400 font-normal">({d.live} live)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Students</span>
                  <span className="text-xs font-bold text-gray-900">{d.students.toLocaleString()}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Completion</span>
                    <span className={`text-xs font-bold ${d.completion > 60 ? "text-emerald-600" : d.completion > 0 ? "text-amber-500" : "text-gray-300"}`}>
                      {d.completion > 0 ? `${d.completion}%` : "—"}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${d.completion}%`, background: d.color }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: Top Courses + Admin Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top Courses */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Top Performing Courses</p>
            <button onClick={() => navigate("/sa/courses")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              All courses <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">#{i + 1}</span>
                <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 bg-gray-100 rounded-full h-1">
                      <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${Math.min(100, (c.enrollments / 400) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{c.enrollments} enrolled</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${c.completionRate > 70 ? "text-emerald-600" : "text-amber-500"}`}>{c.completionRate}%</p>
                  <p className="text-xs text-gray-400">completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Leaderboard */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Admin Leaderboard</p>
            <button onClick={() => navigate("/sa/users")} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Manage <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {adminPerformance.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-base w-6 shrink-0">{["🥇","🥈","🥉"][i]}</span>
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.dept} · {a.courses} courses · {a.students} students</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${a.completion > 60 ? "text-emerald-600" : a.completion > 0 ? "text-amber-500" : "text-gray-300"}`}>
                    {a.completion > 0 ? `${a.completion}%` : "—"}
                  </p>
                  <p className="text-xs text-gray-400">completion</p>
                </div>
              </div>
            ))}

            {/* Invited/pending admins */}
            {admins.filter((a) => a.status === "invited").map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 opacity-50">
                <span className="text-base w-6 shrink-0">⏳</span>
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.department} · Invite pending</p>
                </div>
                <span className="badge-invited text-xs shrink-0">Invited</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
