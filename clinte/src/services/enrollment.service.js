import api from "./axios";

export const getEnrollments = () => api.get("/enrollments");

export const enrollInCourse = (courseId) =>
  api.post("/enrollments", { courseId });

export const updateEnrollmentStatus = (enrollmentId, status) =>
  api.patch(`/enrollments/${enrollmentId}/status`, { status });
