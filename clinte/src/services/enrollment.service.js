import api from "./axios";

export const getEnrollments = () => api.get("/enrollments");

export const updateEnrollmentStatus = (enrollmentId, status) =>
  api.patch(`/enrollments/${enrollmentId}/status`, { status });
