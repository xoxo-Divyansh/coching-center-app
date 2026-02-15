import api from "./axios";

export const getCourses = ({ page = 1, limit = 50 } = {}) =>
  api.get(`/courses?page=${page}&limit=${limit}`);

export const enrollInCourse = (courseId) =>
  api.post("/enrollments", { courseId });

export const getCourseStudents = (courseId) =>
  api.get(`/courses/${courseId}/students`);
