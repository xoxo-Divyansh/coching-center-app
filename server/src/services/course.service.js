import mongoose from "mongoose";
import Course from "../models/Course.js";
import ApiError from "../utils/apiError.js";


// 🛠️ Allowed fields for update
const ALLOWED_UPDATES = ["title", "description", "price", "duration", "level"];

// Create course
export const createCourseService = async (courseData) => {
  return await Course.create(courseData);
};

// Get all courses
export const getAllCoursesService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [course, total] = await Promise.all([
    Course.find()
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Course.countDocuments(),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    count: course.length,
    course,
  };
};

// Get course by ID
export const getCourseByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid course ID", 400);
  }

  const course = await Course.findById(id).populate("createdBy", "name email");

  if (!course) throw new ApiError("Course not found", 404);

  return course;
};

// Update course
export const updateCourseService = async (id, data, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid course ID", 400);
  }

  const course = await Course.findById(id);
  if (!course) throw new ApiError("Course not found", 404);

  // 🔐 Authorization
  if (
    course.createdBy.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    throw new ApiError("Not authorized to update this course", 403);
  }

  // 🧹 Whitelist updates
  for (const key of Object.keys(data)) {
    if (ALLOWED_UPDATES.includes(key)) {
      course[key] = data[key];
    }
  }

  await course.save();

  return await course.populate("createdBy", "name email");
};

// Delete course
export const deleteCourseService = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid course ID", 400);
  }

  const course = await Course.findById(id);
  if (!course) throw new ApiError("Course not found", 404);

  // 🔐 Authorization
  if (
    course.createdBy.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    throw new ApiError("Not authorized to delete this course", 403);
  }

  await course.deleteOne();
};

// ✅ Get students of a course
export const getCourseStudentsService = async (courseId, user) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError("Invalid course ID", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  // 🔐 Authorization
  if (
    user.role !== "admin" &&
    course.createdBy.toString() !== user._id.toString()
  ) {
    throw new ApiError("Not authorized to view course students", 403);
  }

  const enrollments = await Enrollment.find({ course: courseId })
    .populate("student", "name email")
    .select("student");

  const students = enrollments.map((e) => e.student);

  return {
    course: {
      id: course._id,
      title: course.title,
    },
    totalStudents: students.length,
    students,
  };
};
