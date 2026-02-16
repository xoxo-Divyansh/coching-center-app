export const addStudents = async (batchId, students) => {
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  const validStudents = await User.find({
    _id: { $in: students },
    role: "student",
  });

  if (validStudents.length !== students.length) {
    throw new ApiError(400, "One or more students are invalid");
  }

  const existingStudents = new Set(
    batch.students.map((id) => id.toString())
  );

  const newStudents = students.filter(
    (id) => !existingStudents.has(id)
  );

  if (newStudents.length === 0) {
    throw new ApiError(400, "All students are already added to this batch");
  }

  batch.students.push(...newStudents);
  await batch.save();

  return batch;
};
