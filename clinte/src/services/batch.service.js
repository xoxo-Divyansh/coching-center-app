import api from "./axios";

// 🔹 Get all batches (Admin)
export const getAllBatches = async () => {
  const { data } = await api.get("/batches");
  return data.data;
};

// Get batches assigned to logged-in teacher
export const getTeacherBatches = async () => {
  try {
    const { data } = await api.get("/batches/teacher/my");
    return data.data;
  } catch (error) {
    // Admin users can access teacher panel routes; fallback to admin batches API.
    if (error?.response?.status === 403) {
      const { data } = await api.get("/batches");
      return data.data;
    }
    throw error;
  }
};

// 🔹 Create batch (Admin)
export const createBatch = async (payload) => {
  const { data } = await api.post("/batches", payload);
  return data.data;
};

// 🔹 Assign students to batch (Admin)
export const addStudentsToBatch = async (batchId, students) => {
  const { data } = await api.patch(
    `/batches/${batchId}/add-students`,
    { students }
  );
  return data.data;
};

// 🔹 Get all students (Admin)
export const getAllStudents = async () => {
  const { data } = await api.get("/admin/users", {
    params: { role: "student", page: 1, limit: 100 },
  });
  return data.users || [];
};

// 🔹 Assign teacher to batch (Admin)
export const assignTeacherToBatch = async (batchId, teacherId) => {
  const { data } = await api.patch(
    `/batches/${batchId}/assign-teacher`,
    { teacherId }
  );
  return data.data;
};
