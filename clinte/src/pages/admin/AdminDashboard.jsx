import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-6">
        Manage users, teacher requests, and platform operations.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <Link
          to="/admin/teacher-requests"
          className="inline-block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
        >
          Review Teacher Requests
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
