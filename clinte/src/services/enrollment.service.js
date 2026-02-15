import api from "./axios";

export const getEnrollments = () => api.get("/enrollments");

