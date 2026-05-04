import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const PAGE_TITLES: Record<string, string> = {
  "/sa/overview":  "Overview",
  "/sa/library":   "Library",
  "/sa/courses":   "All Courses",
  "/sa/users":     "Users",
  "/sa/analytics": "Analytics",
  "/sa/settings":  "Settings & Logs",
  "/admin/overview":  "Overview",
  "/admin/courses":   "My Courses",
  "/admin/students":  "Students",
  "/admin/analytics": "Analytics & Notifications",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = Object.entries(PAGE_TITLES).find(([p]) => pathname.startsWith(p))?.[1] ?? "Edge Edu";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar title={title} onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto bg-[#f5f6fa] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
