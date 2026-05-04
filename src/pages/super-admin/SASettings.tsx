import { useState } from "react";
import { Save, Download } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { mockAuditLogs } from "../../data/mockData";

type SettingsTab = "platform" | "quiz" | "workflow" | "integrations" | "audit" | "notifications";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "quiz", label: "Quiz Thresholds" },
  { id: "workflow", label: "Approval Workflow" },
  { id: "integrations", label: "Integrations" },
  { id: "audit", label: "Audit Logs" },
  { id: "notifications", label: "Notification Templates" },
];

const NOTIFICATION_TEMPLATES = [
  { id: "enroll", label: "Enrollment Confirmation", subject: "You're enrolled!", body: "Hi {{name}}, you have successfully enrolled in {{course}}." },
  { id: "approve", label: "Course Approved", subject: "Your course is live!", body: "Hi {{name}}, your course '{{course}}' has been approved and is now live." },
  { id: "reject", label: "Course Rejected", subject: "Course needs revision", body: "Hi {{name}}, your course '{{course}}' was returned for revision. Note: {{note}}" },
  { id: "complete", label: "Completion Certificate", subject: "Congratulations!", body: "Hi {{name}}, you've completed {{course}}. Your certificate is attached." },
  { id: "suspend", label: "Account Suspended", subject: "Account suspended", body: "Hi {{name}}, your account has been suspended. Contact support for assistance." },
];

export default function SASettings() {
  const { settings, setSettings } = useApp();
  const [tab, setTab] = useState<SettingsTab>("platform");
  const [saved, setSaved] = useState(false);
  const [templates, setTemplates] = useState(NOTIFICATION_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filteredLogs = mockAuditLogs.filter(
    (l) => !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-brand-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === "platform" && (
          <div className="max-w-lg space-y-4">
            <h3 className="section-title">Platform Configuration</h3>
            <div><label className="label">Platform Name</label><input className="input" value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} /></div>
            <div><label className="label">Support Email</label><input className="input" type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></div>
            <div>
              <label className="label">Logo</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-brand-300 transition-colors">
                <p className="text-sm text-gray-400">Click to upload logo (PNG, SVG, max 2MB)</p>
              </div>
            </div>
            <div><label className="label">Primary Brand Color</label><input type="color" className="h-10 w-20 rounded-lg border border-gray-200 cursor-pointer" defaultValue="#6d28d9" /></div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">Custom domain — planned for future release</div>
            <button className="btn-primary" onClick={save}><Save size={14} />{saved ? "Saved!" : "Save Changes"}</button>
          </div>
        )}

        {tab === "quiz" && (
          <div className="max-w-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="section-title">Quiz Pass Thresholds</h3>
              <span className="badge badge-live text-xs">Editable</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">All thresholds are now configurable by Super Admin.</p>
            {[
              { label: "Quiz Pass Threshold (per video)", key: "quizPassThreshold", desc: "Minimum % correct to pass a video quiz" },
              { label: "MCQ Assessment Pass Threshold", key: "mcqPassThreshold", desc: "Minimum % correct for MCQ assessments" },
              { label: "Scenario AI Grading Pass %", key: "scenarioPassThreshold", desc: "Minimum AI grading score to pass a scenario" },
              { label: "Diagnostic Pass Threshold (per module)", key: "diagnosticPassThreshold", desc: "Minimum % correct for diagnostic quizzes" },
            ].map(({ label, key, desc }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <p className="text-xs text-gray-400 mb-1">{desc}</p>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={100} value={(settings as any)[key]}
                    onChange={(e) => setSettings({ ...settings, [key]: Number(e.target.value) })}
                    className="flex-1 accent-brand-600" />
                  <span className="text-sm font-bold text-brand-600 w-10 text-right">{(settings as any)[key]}%</span>
                </div>
              </div>
            ))}
            <button className="btn-primary mt-4" onClick={save}><Save size={14} />{saved ? "Saved!" : "Save Thresholds"}</button>
          </div>
        )}

        {tab === "workflow" && (
          <div className="max-w-lg">
            <h3 className="section-title mb-4">Approval Workflow</h3>
            <div className="bg-gray-50 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Require SA Approval for New Courses</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {settings.approvalWorkflow
                      ? "ON — Admin courses go to Pending Review before going live"
                      : "OFF — Admin courses publish directly to Live"}
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, approvalWorkflow: !settings.approvalWorkflow })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.approvalWorkflow ? "bg-brand-600" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.approvalWorkflow ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${settings.approvalWorkflow ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-50"}`}>
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div><p className="text-xs font-medium">Draft → Pending Review → Live</p><p className="text-xs text-gray-500">SA approves before course goes public</p></div>
              </div>
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${!settings.approvalWorkflow ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50 opacity-50"}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div><p className="text-xs font-medium">Draft → Live (instant)</p><p className="text-xs text-gray-500">Admin publishes without SA review</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === "integrations" && (
          <div className="max-w-lg space-y-4">
            <h3 className="section-title mb-4">Active Integrations</h3>
            {[
              { name: "AWS S3 (Production)", type: "File Storage", status: "active", desc: "Primary file storage for all course media" },
              { name: "LocalStack", type: "File Storage (Dev)", status: "active", desc: "Local S3 emulation for development environment" },
              { name: "SuprSend", type: "Email Service", status: "active", desc: "Transactional email and notification delivery" },
              { name: "Payment Gateway", type: "Monetization", status: "planned", desc: "Not yet integrated — planned for future release" },
            ].map((i) => (
              <div key={i.name} className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${i.status === "active" ? "bg-emerald-400" : "bg-gray-300"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{i.name}</p>
                    <span className={`badge text-xs ${i.status === "active" ? "badge-live" : "badge-draft"}`}>{i.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{i.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Audit Logs</h3>
              <div className="flex gap-3">
                <input className="input w-52" placeholder="Filter by user or action…" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="btn-secondary"><Download size={14} />Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header text-left">User</th>
                    <th className="table-header text-left">Action</th>
                    <th className="table-header text-left">Resource</th>
                    <th className="table-header text-left">IP Address</th>
                    <th className="table-header text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="table-row">
                      <td className="table-cell font-medium">{l.user}</td>
                      <td className="table-cell"><span className="badge badge-draft">{l.action}</span></td>
                      <td className="table-cell text-gray-500 text-xs">{l.resource}</td>
                      <td className="table-cell text-gray-400 text-xs font-mono">{l.ip}</td>
                      <td className="table-cell text-gray-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="max-w-2xl space-y-4">
            <h3 className="section-title mb-4">Notification Templates</h3>
            {templates.map((t) => (
              <div key={t.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                  <button onClick={() => setEditingTemplate(editingTemplate === t.id ? null : t.id)} className="btn-secondary py-1 px-2.5 text-xs">
                    {editingTemplate === t.id ? "Done" : "Edit"}
                  </button>
                </div>
                {editingTemplate === t.id ? (
                  <div className="space-y-2">
                    <div><label className="label text-xs">Subject</label><input className="input text-sm" value={t.subject} onChange={(e) => setTemplates((p) => p.map((x) => x.id === t.id ? { ...x, subject: e.target.value } : x))} /></div>
                    <div><label className="label text-xs">Body</label><textarea className="input text-sm" rows={3} value={t.body} onChange={(e) => setTemplates((p) => p.map((x) => x.id === t.id ? { ...x, body: e.target.value } : x))} /></div>
                    <p className="text-xs text-gray-400">Variables: {"{{name}}"}, {"{{course}}"}, {"{{note}}"}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600">Subject: {t.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
