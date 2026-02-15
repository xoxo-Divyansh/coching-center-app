import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";

import RoleGuard from "@/guards/RoleGuard";
import RequireAuth from "@/guards/RequireAuth";

import Home from "@/features/public/home/Home";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/profile/Profile";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";

const router = createBrowserRouter([
  // 🌍 Public Pages (Navbar + Footer)
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
    ],
  },

  // 🔐 Auth Pages (No Navbar + No Footer)
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // 🛡 Protected Admin Pages
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      {
        element: <RoleGuard allowedRoles={["teacher", "admin"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [{ path: "teacher", element: <TeacherDashboard /> }],
          },
        ],
      },
      {
        element: <RoleGuard allowedRoles={["admin"]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "admin", element: <AdminDashboard /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
