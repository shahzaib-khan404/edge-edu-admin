import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../../context/AppContext";

const perCourseEnrollments = [
  { month: "Feb", clinical: 45, ai: 30 },
  { month: "Mar", clinical: 72, ai: 55 },
  { month: "Apr", clinical: 120, ai: 89 },
  { month: "May", clinical: 105, ai: 41 },
];

const lessonDropoff = [
  { lesson: "L1", watched: 342 },
  { lesson: "L2", watched: 310 },
  { lesson: "L3", watched: 280 },
  { lesson: "L4", watched: 245 },
  { lesson: "L5", watched: 198 },
  { lesson: "L6", watched: 165 },
  { lesson: "L7", watched: 140 },
];

const COLORS = ["#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd"];

export default function AdminAnalytics() {
  const { courses, currentUser } = useApp();
  const myCourses = courses.filter((c) => c.createdBy === currentUser.id && c.enrollments > 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Enrollments", value: myCourses.reduce((s, c) => s + c.enrollments, 0) },
          { label: "Avg Completion Rate", value: `${Math.round(myCourses.reduce((s, c) => s + c.completionRate, 0) / (myCourses.length || 1))}%` },
          { label: "Avg Quiz Score", value: `${Math.round(myCourses.filter((c) => c.avgQuizScore).reduce((s, c) => s + (c.avgQuizScore ?? 0), 0) / (myCourses.filter((c) => c.avgQuizScore).length || 1))}%` },
          { label: "Live Courses", value: courses.filter((c) => c.createdBy === currentUser.id && c.status === "live").length },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Enrollments over time */}
        <div className="card p-5">
          <p className="section-title mb-4">Enrollments Over Time (per Course)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={perCourseEnrollments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Line type="monotone" dataKey="clinical" stroke="#6d28d9" strokeWidth={2} name="Clinical Assessment" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ai" stroke="#10b981" strokeWidth={2} name="AI in Healthcare" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand-600" /><span className="text-xs text-gray-500">Clinical Assessment</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-gray-500">AI in Healthcare</span></div>
          </div>
        </div>

        {/* Lesson drop-off */}
        <div className="card p-5">
          <p className="section-title mb-1">Lesson Drop-off Heatmap</p>
          <p className="text-xs text-gray-400 mb-4">Where students stop watching (Advanced Clinical Assessment)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={lessonDropoff}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="lesson" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="watched" radius={[4, 4, 0, 0]} name="Students">
                {lessonDropoff.map((_, i) => <Cell key={i} fill={COLORS[Math.min(i, COLORS.length - 1)]} opacity={1 - i * 0.08} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per course metrics */}
      <div className="card p-5">
        <p className="section-title mb-4">Course Metrics</p>
        <div className="space-y-4">
          {myCourses.map((c) => (
            <div key={c.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{c.enrollments} enrolled</span>
                  {c.avgQuizScore && <span className="text-xs text-gray-500">Avg quiz: {c.avgQuizScore}%</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${c.completionRate > 70 ? "bg-emerald-500" : c.completionRate > 40 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${c.completionRate}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-10">{c.completionRate}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">completion</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement */}
      <div className="card p-5">
        <p className="section-title mb-4">Engagement Stats</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-brand-600">42m</p>
            <p className="text-xs text-gray-500 mt-1">Avg session time per learner</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-gray-900">SOAP Method</p>
            <p className="text-xs text-gray-500 mt-1">Most replayed lesson</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-gray-900">Clinical Assessment</p>
            <p className="text-xs text-gray-500 mt-1">Most completed skill</p>
          </div>
        </div>
      </div>
    </div>
  );
}
