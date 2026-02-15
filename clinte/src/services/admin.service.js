import api from "./axios";

export const getAdminStats = () => api.get("/admin/dashboard");

export const getAdminRevenue = () => api.get("/admin/revenue");

export const getAdminUsers = () => api.get("/admin/users");

export const updateAdminUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role });

export const toggleAdminUserBlock = (userId) =>
  api.patch(`/admin/users/${userId}/block`);

export const deleteAdminUser = (userId) =>
  api.delete(`/admin/users/${userId}`);
