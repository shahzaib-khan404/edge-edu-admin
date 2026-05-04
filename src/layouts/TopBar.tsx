import { useState } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TopBar({ title }: { title: string }) {
  const { notifications, setNotifications, unreadCount } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const typeColors: Record<string, string> = {
    approval: "bg-emerald-100 text-emerald-600",
    rejection: "bg-red-100 text-red-600",
    enrollment: "bg-blue-100 text-blue-600",
    completion: "bg-brand-100 text-brand-600",
  };
  const typeLabels: Record<string, string> = {
    approval: "✓", rejection: "✗", enrollment: "👤", completion: "🎓",
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h1 className="page-title">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-80 h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                {unreadCount > 0 && <span className="badge badge-pending">{unreadCount} new</span>}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Mark all read">
                    <CheckCheck size={14} />
                  </button>
                )}
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Bell size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-brand-50/40" : ""}`}
                  >
                    <div className="flex gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${typeColors[n.type]}`}>
                        {typeLabels[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 ml-1" />}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
