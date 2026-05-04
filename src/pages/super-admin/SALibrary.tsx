import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

type Tab = "skills" | "categories" | "languages" | "badges" | "instructors" | "departments";

const TABS: { id: Tab; label: string }[] = [
  { id: "skills", label: "Skills" },
  { id: "categories", label: "Categories" },
  { id: "languages", label: "Languages" },
  { id: "badges", label: "Badges & Certs" },
  { id: "instructors", label: "Instructors" },
  { id: "departments", label: "Departments" },
];

export default function SALibrary() {
  const { skills, setSkills, categories, setCategories, languages, setLanguages, badges, setBadges, instructors, setInstructors, departments, setDepartments, users } = useApp();
  const [tab, setTab] = useState<Tab>("skills");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [form, setForm] = useState<any>({});

  const open = (item?: any) => {
    setForm(item ?? {});
    setModal({ open: true, editing: item });
  };

  const save = () => {
    const id = form.id ?? `new_${Date.now()}`;
    const isNew = !form.id;
    if (tab === "skills") setSkills((p) => isNew ? [...p, { ...form, id }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    if (tab === "categories") setCategories((p) => isNew ? [...p, { ...form, id }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    if (tab === "languages") setLanguages((p) => isNew ? [...p, { ...form, id }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    if (tab === "badges") setBadges((p) => isNew ? [...p, { ...form, id }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    if (tab === "instructors") setInstructors((p) => isNew ? [...p, { ...form, id }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    if (tab === "departments") setDepartments((p) => isNew ? [...p, { ...form, id, adminIds: [] }] : p.map((x) => x.id === id ? { ...x, ...form } : x));
    setModal({ open: false });
  };

  const del = (id: string) => {
    if (tab === "skills") setSkills((p) => p.filter((x) => x.id !== id));
    if (tab === "categories") setCategories((p) => p.filter((x) => x.id !== id));
    if (tab === "languages") setLanguages((p) => p.filter((x) => x.id !== id));
    if (tab === "badges") setBadges((p) => p.filter((x) => x.id !== id));
    if (tab === "instructors") setInstructors((p) => p.filter((x) => x.id !== id));
    if (tab === "departments") setDepartments((p) => p.filter((x) => x.id !== id));
  };

  const currentData = () => {
    const q = search.toLowerCase();
    if (tab === "skills") return skills.filter((s) => s.name.toLowerCase().includes(q));
    if (tab === "categories") return categories.filter((c) => c.name.toLowerCase().includes(q));
    if (tab === "languages") return languages.filter((l) => l.name.toLowerCase().includes(q));
    if (tab === "badges") return badges.filter((b) => b.name.toLowerCase().includes(q));
    if (tab === "instructors") return instructors.filter((i) => i.name.toLowerCase().includes(q));
    if (tab === "departments") return departments.filter((d) => d.name.toLowerCase().includes(q));
    return [];
  };

  const admins = users.filter((u) => u.role === "admin");

  const FormFields = () => {
    if (tab === "skills") return (
      <>
        <div className="mb-3"><label className="label">Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Category</label><input className="input" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
      </>
    );
    if (tab === "categories") return (
      <>
        <div className="mb-3"><label className="label">Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Icon (emoji)</label><input className="input" value={form.icon ?? ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Color (hex)</label><input className="input" type="color" value={form.color ?? "#6d28d9"} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
      </>
    );
    if (tab === "languages") return (
      <>
        <div className="mb-3"><label className="label">Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="label">ISO Code</label><input className="input" placeholder="en, ur, ar…" value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
      </>
    );
    if (tab === "badges") return (
      <>
        <div className="mb-3"><label className="label">Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Description</label><textarea className="input" rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      </>
    );
    if (tab === "instructors") return (
      <>
        <div className="mb-3"><label className="label">Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Email</label><input className="input" type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="mb-3"><label className="label">Bio</label><textarea className="input" rows={3} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <div className="mb-3"><label className="label">LinkedIn URL</label><input className="input" value={form.linkedin ?? ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
      </>
    );
    if (tab === "departments") return (
      <>
        <div className="mb-3"><label className="label">Department Name</label><input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3">
          <label className="label">Assign Admin</label>
          <select className="select" value={form.adminId ?? ""} onChange={(e) => setForm({ ...form, adminId: e.target.value })}>
            <option value="">— none —</option>
            {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </>
    );
    return null;
  };

  const renderRow = (item: any) => (
    <tr key={item.id} className="table-row">
      <td className="table-cell font-medium">
        {tab === "categories" && <span className="mr-2">{item.icon}</span>}
        {item.name}
      </td>
      <td className="table-cell text-gray-400">
        {tab === "skills" && item.category}
        {tab === "categories" && <span className="inline-block w-4 h-4 rounded" style={{ background: item.color }} />}
        {tab === "languages" && item.code?.toUpperCase()}
        {tab === "badges" && <span className="text-xs">{item.description}</span>}
        {tab === "instructors" && item.email}
        {tab === "departments" && `${item.adminIds?.length ?? 0} admin(s)`}
      </td>
      <td className="table-cell">
        <div className="flex gap-2">
          <button onClick={() => open(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors"><Edit2 size={13} /></button>
          <button onClick={() => setConfirm({ open: true, id: item.id })} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-brand-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="section-title">{TABS.find((t) => t.id === tab)?.label}</p>
          <div className="flex gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-8 w-52" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={() => open()}>
              <Plus size={14} />Add {TABS.find((t) => t.id === tab)?.label.replace("& Certs", "").trim()}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header text-left">Name</th>
                <th className="table-header text-left">Details</th>
                <th className="table-header text-left w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData().map(renderRow)}
              {currentData().length === 0 && (
                <tr><td colSpan={3} className="text-center py-12 text-sm text-gray-400">No {tab} found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={`${modal.editing ? "Edit" : "Create"} ${TABS.find((t) => t.id === tab)?.label}`}>
        <FormFields />
        <div className="flex gap-3 justify-end mt-4">
          <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
        onConfirm={() => del(confirm.id!)}
        title="Delete Item"
        message="This item may be in use by existing courses. Are you sure you want to delete it?"
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
