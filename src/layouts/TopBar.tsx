import { useState } from "react";
import { Bell, X, CheckCheck, Menu } from "lucide-react";
import { useApp } from "../context/AppContext";

interface TopBarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function TopBar({ title, onMenuToggle }: TopBarProps) {
  const { notifications, setNotifications, unreadCount } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const typeColors: Record<string, string> = {
    approval:   "bg-emerald-100 text-emerald-600",
    rejection:  "bg-red-100 text-red-600",
    enrollment: "bg-blue-100 text-blue-600",
    completion: "bg-brand-100 text-brand-600",
  };
  const typeLabels: Record<string, string> = {
    approval: "✓", rejection: "✗", enrollment: "👤", completion: "🎓",
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          {/* Hamburger — only on mobile */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <h1 className="page-title text-base md:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-2xs rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-sm h-full bg-white shadow-card-lg flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Bell size={15} className="text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                {unreadCount > 0 && <span className="badge badge-pending">{unreadCount} new</span>}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Mark all read">
                    <CheckCheck size={14} />
                  </button>
                )}
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Bell size={20} className="opacity-30" />
                  </div>
                  <p className="text-sm text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`px-5 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-brand-50/40" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${typeColors[n.type] ?? "bg-gray-100 text-gray-500"}`}>
                        {typeLabels[n.type] ?? "•"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 ml-2" />}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                        <p className="text-2xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
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
