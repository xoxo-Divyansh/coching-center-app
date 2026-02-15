import api from "./axios";

export const getAdminStats = () => api.get("/admin/dashboard");

export const getAdminRevenue = () => api.get("/admin/revenue");

export const getAdminUsers = () => api.get("/admin/users");
