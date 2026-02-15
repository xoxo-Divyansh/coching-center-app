import { useCallback, useEffect, useState } from "react";
import {
  deleteAdminUser,
  getAdminUsers,
  toggleAdminUserBlock,
  updateAdminUserRole,
} from "@/services/admin.service";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const ROLES = ["student", "teacher", "admin"];

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const loadUsers = useCallback(async (nextPage = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminUsers({
        q: debouncedSearch,
        role: roleFilter,
        page: nextPage,
        limit,
      });
      setUsers(res.data?.users || []);
      setPage(res.data?.page || nextPage);
      setPages(res.data?.pages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, limit, roleFilter]);

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleRoleUpdate = async (userId, role) => {
    try {
      setMessage("");
      await updateAdminUserRole(userId, role);
      setMessage("User role updated.");
      await loadUsers(page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role.");
    }
  };

  const handleBlockToggle = async (userId) => {
    try {
      setMessage("");
      await toggleAdminUserBlock(userId);
      setMessage("User block status updated.");
      await loadUsers(page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update block status.");
    }
  };

  const handleDelete = async (userId) => {
    const shouldDelete = window.confirm(
      "Delete this user permanently? This action cannot be undone.",
    );
    if (!shouldDelete) return;

    try {
      setMessage("");
      await deleteAdminUser(userId);
      setMessage("User deleted.");
      await loadUsers(page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    }
  };

  if (loading) {
    return <p className="text-zinc-300">Loading users...</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">User Management</h1>
      <p className="text-zinc-400 mb-6">
        Manage user roles, block status, and account lifecycle.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-300">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5 text-zinc-200">
          {message}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => loadUsers(page)}
          className="border border-zinc-600 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead className="text-left text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800/60">
                <td className="py-2 pr-3">{user.name}</td>
                <td className="py-2 pr-3 text-zinc-300">{user.email}</td>
                <td className="py-2 pr-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs capitalize"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  {user.isBlocked ? (
                    <span className="text-red-300">Blocked</span>
                  ) : (
                    <span className="text-green-300">Active</span>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBlockToggle(user._id)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="py-4 text-zinc-400" colSpan={5}>
                  No users found for current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        <p>
          Showing page {page} of {pages} ({total} total users)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadUsers(Math.max(page - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded border border-zinc-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => loadUsers(Math.min(page + 1, pages))}
            disabled={page >= pages}
            className="px-3 py-1.5 rounded border border-zinc-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;
