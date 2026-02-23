import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut, Shield, User } from "lucide-react";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold uppercase hover:scale-105 transition"
      >
        {user.name?.[0] || "U"}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in">

          <div className="px-4 py-3 border-b border-zinc-700">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>

          <div className="flex flex-col">

            <Link to="/dashboard" className="dropdown-item">
              <LayoutDashboard size={16} /> Dashboard
            </Link>

            <Link to="/profile" className="dropdown-item">
              <User size={16} /> Profile
            </Link>

            {user.role === "student" && (
              <Link to="/teacher-request" className="dropdown-item">
                <LayoutDashboard size={16} /> Become Teacher
              </Link>
            )}

            {user.role === "teacher" && (
              <>
                <Link to="/teacher" className="dropdown-item">
                  <LayoutDashboard size={16} /> Teacher Panel
                </Link>
                <Link to="/teacher/courses" className="dropdown-item">
                  <LayoutDashboard size={16} /> My Courses
                </Link>
                <Link to="/teacher/attendance" className="dropdown-item">
                  <LayoutDashboard size={16} /> Attendance
                </Link>
              </>
            )}

            {user.role === "admin" && (
              <>
                <Link to="/admin" className="dropdown-item">
                  <Shield size={16} /> Admin Panel
                </Link>
                <Link to="/admin/teacher-requests" className="dropdown-item">
                  <Shield size={16} /> Teacher Requests
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="dropdown-item text-red-400"
            >
              <LogOut size={16} /> Logout
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
