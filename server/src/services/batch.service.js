import mongoose from "mongoose";
import Batch from "../models/Batch.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";

const assertObjectId = (id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${label} id`, 400);
  }
};

const populateBatch = (query) =>
  query
    .populate("course", "title")
    .populate("teacher", "name email")
    .populate("students", "name email");

export const createBatch = async (payload) => {
  const { course, teacher = null, students = [] } = payload;

  assertObjectId(course, "course");
  const existingCourse = await Course.findById(course);
  if (!existingCourse) {
    throw new ApiError("Course not found", 404);
  }

  if (teacher) {
    assertObjectId(teacher, "teacher");
    const teacherUser = await User.findOne({ _id: teacher, role: "teacher" });
    if (!teacherUser) {
      throw new ApiError("Teacher not found", 404);
    }
  }

  if (students.length) {
    const uniqueStudents = [...new Set(students)];
    const validStudents = await User.find({
      _id: { $in: uniqueStudents },
      role: "student",
    }).select("_id");

    if (validStudents.length !== uniqueStudents.length) {
      throw new ApiError("One or more students are invalid", 400);
    }
  }

  const created = await Batch.create(payload);
  return populateBatch(Batch.findById(created._id));
};

export const assignTeacher = async (batchId, teacherId) => {
  assertObjectId(batchId, "batch");
  assertObjectId(teacherId, "teacher");

  const [batch, teacher] = await Promise.all([
    Batch.findById(batchId),
    User.findOne({ _id: teacherId, role: "teacher" }),
  ]);

  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }
  if (!teacher) {
    throw new ApiError("Teacher not found", 404);
  }

  batch.teacher = teacherId;
  await batch.save();

  return populateBatch(Batch.findById(batchId));
};

export const addStudents = async (batchId, students) => {
  assertObjectId(batchId, "batch");
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }

  const uniqueStudents = [...new Set(students)];
  const validStudents = await User.find({
    _id: { $in: uniqueStudents },
    role: "student",
  }).select("_id");

  if (validStudents.length !== uniqueStudents.length) {
    throw new ApiError("One or more students are invalid", 400);
  }

  const existingStudents = new Set(batch.students.map((id) => id.toString()));
  const newStudents = uniqueStudents.filter((id) => !existingStudents.has(id));

  if (newStudents.length === 0) {
    throw new ApiError("All students are already added to this batch", 400);
  }

  batch.students.push(...newStudents);
  await batch.save();

  return populateBatch(Batch.findById(batchId));
};

export const removeStudents = async (batchId, students) => {
  assertObjectId(batchId, "batch");
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }

  const originalCount = batch.students.length;
  batch.students = batch.students.filter((id) => !students.includes(id.toString()));

  if (batch.students.length === originalCount) {
    throw new ApiError("No matching students found in this batch", 400);
  }

  await batch.save();
  return populateBatch(Batch.findById(batchId));
};

export const getAllBatches = async () => {
  return populateBatch(Batch.find().sort({ createdAt: -1 }));
};

export const getTeacherBatches = async (teacherId) => {
  assertObjectId(teacherId, "teacher");
  return populateBatch(Batch.find({ teacher: teacherId }).sort({ createdAt: -1 }));
};

export const getStudentBatches = async (studentId) => {
  assertObjectId(studentId, "student");
  return populateBatch(
    Batch.find({ students: studentId }).sort({ createdAt: -1 }),
  );
};

export const getBatchById = async (batchId) => {
  assertObjectId(batchId, "batch");
  const batch = await populateBatch(Batch.findById(batchId));
  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }
  return batch;
};

export const getBatchStudents = async (batchId) => {
  assertObjectId(batchId, "batch");
  const batch = await populateBatch(Batch.findById(batchId));
  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }
  return batch.students;
};
