import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";


import RequireAuth from "@/guards/RequireAuth";

import Home from "@/features/public/home/Home";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    element: <MainLayout />,
    children: [{ path: "/", element: <Home /> }],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    element: <RequireAuth />, // 🔐 AUTH GUARD
    children: [
      {
        element: <AdminLayout />,
        children: [{ path: "/admin", element: <AdminDashboard /> }],
      },
    ],
  },
]);

export default router;
