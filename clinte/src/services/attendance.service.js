import api from "./axios";

export const getBatchStudents = async (batchId) => {
  const { data } = await api.get(`/batches/${batchId}/students`);
  return data.data;
};

export const markAttendance = async (payload) => {
  const { data } = await api.post("/attendance", payload);
  return data.data;
};

export const getBatchAttendance = async (batchId) => {
  const { data } = await api.get(`/attendance/batch/${batchId}`);
  return data.data;
};
