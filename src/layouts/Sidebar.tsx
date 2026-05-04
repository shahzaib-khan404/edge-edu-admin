import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard, BookOpen, Users, BarChart3, Settings,
  Library, GraduationCap, LogOut, Shield, UserCog,
} from "lucide-react";

const SA_NAV = [
  { path: "/sa/overview", label: "Overview", icon: LayoutDashboard },
  { path: "/sa/library", label: "Library", icon: Library },
  { path: "/sa/courses", label: "All Courses", icon: BookOpen },
  { path: "/sa/users", label: "Users", icon: Users },
  { path: "/sa/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/sa/settings", label: "Settings & Logs", icon: Settings },
];

const ADMIN_NAV = [
  { path: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { path: "/admin/courses", label: "My Courses", icon: BookOpen },
  { path: "/admin/students", label: "Students", icon: Users },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { currentRole, currentUser, courses, unreadCount, logout } = useApp();
  const navigate = useNavigate();
  const nav = currentRole === "super_admin" ? SA_NAV : ADMIN_NAV;
  const pendingCount = courses.filter((c) => c.status === "pending_review").length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-60 min-h-screen bg-[#12103a] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Edge Edu</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentRole === "super_admin" ? "bg-brand-600/20 border border-brand-500/30" : "bg-blue-600/20 border border-blue-500/30"}`}>
          {currentRole === "super_admin"
            ? <Shield size={13} className="text-brand-400 shrink-0" />
            : <UserCog size={13} className="text-blue-400 shrink-0" />
          }
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${currentRole === "super_admin" ? "text-brand-300" : "text-blue-300"}`}>
              {currentRole === "super_admin" ? "Super Admin" : "Admin"}
            </p>
            {currentUser.department && (
              <p className="text-gray-500 text-xs truncate">{currentUser.department}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ path, label, icon: Icon }) => {
          const showPending = label === "All Courses" && pendingCount > 0;
          const showNotif = label === "Analytics" && currentRole === "admin" && unreadCount > 0;
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {showPending && (
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              {showNotif && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{currentUser.name}</p>
            <p className="text-gray-500 text-xs truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
