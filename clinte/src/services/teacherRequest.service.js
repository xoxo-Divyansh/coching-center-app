import api from "./axios";

export const submitTeacherRequest = (data) =>
  api.post("/teacher-requests", data);

export const getTeacherRequests = () => api.get("/teacher-requests");

export const reviewTeacherRequest = (id, status) =>
  api.patch(`/teacher-requests/${id}/review`, { status });
