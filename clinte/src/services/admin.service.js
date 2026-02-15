import api from "./axios";

export const getAdminStats = () => api.get("/admin/dashboard");

export const getAdminRevenue = () => api.get("/admin/revenue");

export const getAdminUsers = ({
  q = "",
  role = "all",
  page = 1,
  limit = 10,
} = {}) =>
  api.get("/admin/users", {
    params: { q, role, page, limit },
  });

export const updateAdminUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role });

export const toggleAdminUserBlock = (userId) =>
  api.patch(`/admin/users/${userId}/block`);

export const deleteAdminUser = (userId) =>
  api.delete(`/admin/users/${userId}`);
