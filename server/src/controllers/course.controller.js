import Course from "../models/Course.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// 🔐 Admin creates course
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, level } = req.body;

  if (!title || !description || !price || !duration) {
    throw new ApiError("All fields are required", 400);
  }

  const course = await Course.create({
    title,
    description,
    price,
    duration,
    level,
    createdBy: req.user._id, // 👈 admin from authMiddleware
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});


// 📚 Get all courses (ANY USER)
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});

// 📖 Get single course
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  res.status(200).json({
    success: true,
    course,
  });
});

// ✏️ Update course (ADMIN)
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  Object.assign(course, req.body);
  await course.save();

  res.status(200).json({
    success: true,
    course,
  });
});

// ❌ Delete course (ADMIN)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});