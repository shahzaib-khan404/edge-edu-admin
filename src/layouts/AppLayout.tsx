import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const PAGE_TITLES: Record<string, string> = {
  "/sa/overview": "Overview",
  "/sa/library": "Library",
  "/sa/courses": "All Courses",
  "/sa/users": "Users",
  "/sa/analytics": "Analytics",
  "/sa/settings": "Settings & Logs",
  "/admin/overview": "Overview",
  "/admin/courses": "My Courses",
  "/admin/students": "Students",
  "/admin/analytics": "Analytics & Notifications",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = Object.entries(PAGE_TITLES).find(([p]) => pathname.startsWith(p))?.[1] ?? "Edge Edu";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
