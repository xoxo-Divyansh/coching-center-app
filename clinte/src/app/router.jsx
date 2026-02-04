import { createBrowserRouter } from "react-router-dom";

// layouts
import MainLayout from "@/layouts/MainLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

// pages
import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Courses from "@/pages/courses/Courses";
import AdminDashboard from "@/pages/admin/AdminDashboard";

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
    children: [{ path: "/courses", element: <Courses /> }],
  },
  {
    element: <AppLayout />,
    children: [{ path: "/admin", element: <AdminDashboard /> }],
  },
]);

export default router;
