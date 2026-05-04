import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import SAOverview from "./pages/super-admin/SAOverview";
import SALibrary from "./pages/super-admin/SALibrary";
import SACourses from "./pages/super-admin/SACourses";
import SAUsers from "./pages/super-admin/SAUsers";
import SAAnalytics from "./pages/super-admin/SAAnalytics";
import SASettings from "./pages/super-admin/SASettings";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: "super_admin" | "admin" }) {
  const { isLoggedIn, currentRole } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={currentRole === "super_admin" ? "/sa/overview" : "/admin/overview"} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn, currentRole } = useApp();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn
        ? <Navigate to={currentRole === "super_admin" ? "/sa/overview" : "/admin/overview"} replace />
        : <Login />}
      />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Super Admin only */}
        <Route path="/sa/overview"  element={<ProtectedRoute allowedRole="super_admin"><SAOverview /></ProtectedRoute>} />
        <Route path="/sa/library"   element={<ProtectedRoute allowedRole="super_admin"><SALibrary /></ProtectedRoute>} />
        <Route path="/sa/courses"   element={<ProtectedRoute allowedRole="super_admin"><SACourses /></ProtectedRoute>} />
        <Route path="/sa/users"     element={<ProtectedRoute allowedRole="super_admin"><SAUsers /></ProtectedRoute>} />
        <Route path="/sa/analytics" element={<ProtectedRoute allowedRole="super_admin"><SAAnalytics /></ProtectedRoute>} />
        <Route path="/sa/settings"  element={<ProtectedRoute allowedRole="super_admin"><SASettings /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin/overview"  element={<ProtectedRoute allowedRole="admin"><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/courses"   element={<ProtectedRoute allowedRole="admin"><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/students"  element={<ProtectedRoute allowedRole="admin"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><AdminAnalytics /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
