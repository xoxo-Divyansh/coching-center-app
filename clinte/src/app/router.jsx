import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";

import RoleGuard from "@/guards/RoleGuard";
import RequireAuth from "@/guards/RequireAuth";

import Home from "@/modules/public/pages/Home";
import About from "@/modules/public/pages/About";
import Login from "@/modules/auth/pages/Login";
import Register from "@/modules/auth/pages/Register";
import Courses from "@/modules/course/pages/Courses";

import AdminDashboard from "@/modules/admin/pages/AdminDashboard";
import TeacherRequestsAdmin from "@/modules/admin/pages/TeacherRequestsAdmin";
import AdminUsers from "@/modules/admin/pages/AdminUsers";
import BatchList from "@/modules/batch/pages/BatchList";
import CreateBatch from "@/modules/batch/pages/CreateBatch";
import AssignStudents from "@/modules/batch/pages/AssignStudents";
import TeacherDashboard from "@/modules/teacher/pages/TeacherDashboard";
import TeacherCourses from "@/modules/teacher/pages/TeacherCourses";
import Attendance from "@/modules/attendance/pages/Attendance";
import Dashboard from "@/modules/student/pages/Dashboard";
import Profile from "@/modules/student/pages/Profile";
import TeacherRequestPage from "@/modules/student/pages/TeacherRequestPage";

const router = createBrowserRouter([
  // 🌍 Public Pages (Navbar + Footer)
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/courses", element: <Courses /> },
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
            children: [
              { path: "teacher", element: <TeacherDashboard /> },
              { path: "teacher/courses", element: <TeacherCourses /> },
              { path: "teacher/attendance", element: <Attendance /> },
            ],
          },
        ],
      },
      {
        element: <RoleGuard allowedRoles={["student"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "teacher-request", element: <TeacherRequestPage /> },
            ],
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
              { path: "admin/users", element: <AdminUsers /> },
              {
                path: "admin/teacher-requests",
                element: <TeacherRequestsAdmin />,
              },

              // 🆕 Batch Routes
              { path: "admin/batches", element: <BatchList /> },
              { path: "admin/batches/create", element: <CreateBatch /> },
              { path: "admin/batches/:id/assign", element: <AssignStudents /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
