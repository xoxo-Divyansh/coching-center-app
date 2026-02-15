import api from "./axios";

export const submitTeacherRequest = (data) =>
  api.post("/teacher-requests", data);

export const getMyTeacherRequest = () => api.get("/teacher-requests/me");

export const getTeacherRequests = ({
  q = "",
  status = "all",
  page = 1,
  limit = 10,
} = {}) =>
  api.get("/teacher-requests", {
    params: { q, status, page, limit },
  });

export const reviewTeacherRequest = (id, status) =>
  api.patch(`/teacher-requests/${id}/review`, { status });
