import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminRevenue,
  getAdminStats,
  getAdminUsers,
} from "@/services/admin.service";
import { getTeacherRequests } from "@/services/teacherRequest.service";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingTeacherRequests, setPendingTeacherRequests] = useState(0);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, revenueRes, usersRes, teacherRequestRes] = await Promise.all([
        getAdminStats(),
        getAdminRevenue(),
        getAdminUsers(),
        getTeacherRequests(),
      ]);

      setStats(statsRes.data?.stats || {});
      setRevenue(revenueRes.data?.revenue || {});
      setUsers(usersRes.data?.users || []);
      const teacherRequests = teacherRequestRes.data?.requests || [];
      setPendingTeacherRequests(
        teacherRequests.filter((req) => req.status === "pending").length,
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  if (loading) {
    return <div className="text-zinc-300">Loading admin dashboard...</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-6">
        Manage users, teacher requests, and platform operations.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold mt-1">{stats?.users ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Students</p>
          <p className="text-2xl font-bold mt-1">{stats?.students ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Teachers</p>
          <p className="text-2xl font-bold mt-1">{stats?.teachers ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Admins</p>
          <p className="text-2xl font-bold mt-1">{stats?.admins ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Courses</p>
          <p className="text-2xl font-bold mt-1">{stats?.courses ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Enrollments</p>
          <p className="text-2xl font-bold mt-1">{stats?.enrollments ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Pending Teacher Requests</p>
          <p className="text-2xl font-bold mt-1">{pendingTeacherRequests}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Revenue Overview</h2>
          <p className="text-zinc-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(revenue?.totalRevenue)}
          </p>
          <p className="text-zinc-400 text-sm mt-4">Paid Enrollments</p>
          <p className="text-xl font-semibold mt-1">
            {revenue?.totalEnrollments ?? 0}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Top Courses By Revenue</h2>
          <div className="space-y-3">
            {(revenue?.revenueByCourse || []).slice(0, 5).map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-200">{course.title}</span>
                <span className="text-zinc-400">
                  {formatCurrency(course.revenue)}
                </span>
              </div>
            ))}
            {(revenue?.revenueByCourse || []).length === 0 && (
              <p className="text-zinc-400 text-sm">No revenue data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 8).map((user) => (
                <tr key={user._id} className="border-b border-zinc-800/60">
                  <td className="py-2 pr-3">{user.name}</td>
                  <td className="py-2 pr-3 text-zinc-300">{user.email}</td>
                  <td className="py-2 pr-3 capitalize">{user.role}</td>
                  <td className="py-2 pr-3">
                    {user.isBlocked ? (
                      <span className="text-red-300">Blocked</span>
                    ) : (
                      <span className="text-green-300 capitalize">
                        {user.status || "active"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="py-3 text-zinc-400" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="inline-block bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg font-semibold"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/teacher-requests"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
          >
            Review Teacher Requests
          </Link>
          <button
            onClick={loadDashboard}
            className="inline-block border border-zinc-600 hover:bg-zinc-800 px-4 py-2 rounded-lg font-semibold"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
