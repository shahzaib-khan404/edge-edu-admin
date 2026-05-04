import { useState } from "react";
import { UserPlus, Edit2, Lock, Unlock, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SearchInput from "../../components/ui/SearchInput";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { User } from "../../types";

export default function SAUsers() {
  const { users, setUsers, departments } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", department: "" });
  const [suspendConfirm, setSuspendConfirm] = useState<User | null>(null);

  const tabs = [
    { id: "all", label: "All" },
    { id: "admin", label: "Admins" },
    { id: "user", label: "Users" },
    { id: "suspended", label: "Suspended" },
  ];

  const filtered = users.filter((u) => {
    if (filter === "suspended") return u.status === "suspended";
    if (filter === "admin") return u.role === "admin" || u.role === "super_admin";
    if (filter === "user") return u.role === "user";
    return true;
  }).filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleSuspend = (u: User) => {
    setUsers((p) => p.map((x) => x.id === u.id ? { ...x, status: x.status === "suspended" ? "active" : "suspended" } : x));
  };

  const changeRole = (id: string, role: string) => {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, role: role as any } : u));
  };

  const inviteAdmin = () => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: inviteForm.email.split("@")[0],
      email: inviteForm.email,
      role: "admin",
      status: "invited",
      dateJoined: new Date().toISOString().split("T")[0],
      department: inviteForm.department,
    };
    setUsers((p) => [...p, newUser]);
    setInviteModal(false);
    setInviteForm({ email: "", department: "" });
  };

  const roleColor: Record<string, string> = {
    super_admin: "bg-brand-100 text-brand-700",
    admin: "bg-blue-100 text-blue-700",
    user: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === t.id ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {t.label}
                <span className="ml-1.5 text-xs opacity-60">
                  {t.id === "all" ? users.length :
                    t.id === "suspended" ? users.filter((u) => u.status === "suspended").length :
                    t.id === "admin" ? users.filter((u) => u.role === "admin" || u.role === "super_admin").length :
                    users.filter((u) => u.role === "user").length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search users…" />
            <button className="btn-primary" onClick={() => setInviteModal(true)}>
              <UserPlus size={14} />Invite Admin
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header text-left">User</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Department</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Joined</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="relative inline-block">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full pr-6 border-0 cursor-pointer ${roleColor[u.role] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="table-cell text-xs text-gray-500">{u.department ?? "—"}</td>
                  <td className="table-cell">
                    <span className={`badge-${u.status}`}>{u.status}</span>
                  </td>
                  <td className="table-cell text-xs text-gray-400">{u.dateJoined}</td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(u)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setSuspendConfirm(u)} className={`p-1.5 rounded transition-colors ${u.status === "suspended" ? "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600" : "hover:bg-red-50 text-gray-400 hover:text-red-600"}`}>
                        {u.status === "suspended" ? <Unlock size={13} /> : <Lock size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
                {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="label">Role</p>
                <select className="select" value={selected.role} onChange={(e) => { changeRole(selected.id, e.target.value); setSelected({ ...selected, role: e.target.value as any }); }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <p className="label">Department</p>
                <select className="select" value={selected.department ?? ""} onChange={(e) => {
                  const d = e.target.value;
                  setUsers((p) => p.map((u) => u.id === selected.id ? { ...u, department: d } : u));
                  setSelected({ ...selected, department: d });
                }}>
                  <option value="">— none —</option>
                  {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p className="label">Status</p>
              <span className={`badge-${selected.status}`}>{selected.status}</span>
            </div>
            <div>
              <p className="label">Joined</p>
              <p className="text-sm text-gray-700">{selected.dateJoined}</p>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              <button className={selected.status === "suspended" ? "btn-primary" : "btn-danger"} onClick={() => { toggleSuspend(selected); setSelected(null); }}>
                {selected.status === "suspended" ? <><Unlock size={14} />Activate</> : <><Lock size={14} />Suspend</>}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite Modal */}
      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite Admin" size="sm">
        <div className="space-y-3">
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="admin@company.com" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Assign Department</label>
            <select className="select" value={inviteForm.department} onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}>
              <option value="">— select —</option>
              {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            An onboarding email will be sent via SuprSend. The admin sets their password on first login.
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button className="btn-secondary" onClick={() => setInviteModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={inviteAdmin} disabled={!inviteForm.email || !inviteForm.department}>
              <UserPlus size={14} />Send Invite
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!suspendConfirm}
        onClose={() => setSuspendConfirm(null)}
        onConfirm={() => toggleSuspend(suspendConfirm!)}
        title={suspendConfirm?.status === "suspended" ? "Activate Account" : "Suspend Account"}
        message={`Are you sure you want to ${suspendConfirm?.status === "suspended" ? "activate" : "suspend"} ${suspendConfirm?.name}? This action will be logged.`}
        confirmLabel={suspendConfirm?.status === "suspended" ? "Activate" : "Suspend"}
        danger={suspendConfirm?.status !== "suspended"}
      />
    </div>
  );
}
