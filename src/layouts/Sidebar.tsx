import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard, BookOpen, Users, BarChart3, Settings,
  Library, GraduationCap, LogOut, Shield, UserCog, X,
} from "lucide-react";

const SA_NAV = [
  { path: "/sa/overview",  label: "Overview",      icon: LayoutDashboard },
  { path: "/sa/library",   label: "Library",        icon: Library         },
  { path: "/sa/courses",   label: "All Courses",    icon: BookOpen        },
  { path: "/sa/users",     label: "Users",          icon: Users           },
  { path: "/sa/analytics", label: "Analytics",      icon: BarChart3       },
  { path: "/sa/settings",  label: "Settings & Logs",icon: Settings        },
];

const ADMIN_NAV = [
  { path: "/admin/overview",  label: "Overview",   icon: LayoutDashboard },
  { path: "/admin/courses",   label: "My Courses", icon: BookOpen        },
  { path: "/admin/students",  label: "Students",   icon: Users           },
  { path: "/admin/analytics", label: "Analytics",  icon: BarChart3       },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentRole, currentUser, courses, unreadCount, logout } = useApp();
  const navigate = useNavigate();
  const nav = currentRole === "super_admin" ? SA_NAV : ADMIN_NAV;
  const pendingCount = courses.filter((c) => c.status === "pending_review").length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        w-64 min-h-screen bg-[#0f0d2e] flex flex-col shrink-0
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo + mobile close */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
            <GraduationCap size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">Edge Edu</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${
          currentRole === "super_admin"
            ? "bg-brand-600/15 border-brand-500/25"
            : "bg-blue-600/15 border-blue-500/25"
        }`}>
          {currentRole === "super_admin"
            ? <Shield size={13} className="text-brand-400 shrink-0" />
            : <UserCog size={13} className="text-blue-400 shrink-0" />
          }
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${currentRole === "super_admin" ? "text-brand-300" : "text-blue-300"}`}>
              {currentRole === "super_admin" ? "Super Admin" : "Dept. Admin"}
            </p>
            {currentUser.department && (
              <p className="text-gray-500 text-xs truncate">{currentUser.department}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-2xs font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        {nav.map(({ path, label, icon: Icon }) => {
          const showPending = label === "All Courses" && pendingCount > 0;
          const showNotif   = label === "Analytics" && currentRole === "admin" && unreadCount > 0;
          return (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={15} />
              <span className="flex-1 text-sm">{label}</span>
              {showPending && (
                <span className="ml-auto bg-amber-500 text-white text-2xs font-bold rounded-md px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
              {showNotif && (
                <span className="ml-auto bg-red-500 text-white text-2xs font-bold rounded-md px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
            <p className="text-gray-500 text-xs truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-gray-500 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={14} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
