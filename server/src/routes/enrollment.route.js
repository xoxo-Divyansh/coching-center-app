import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// ➕ Student enroll in course
export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    throw new ApiError("Course ID is required", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  // check if already enrolled
  const already = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });
  if (already) {
    throw new ApiError("You are already enrolled in this course", 400);
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  res.status(201).json({
    success: true,
    enrollment,
  });
});

// 📚 Get all enrollments (Admin / Teacher)
export const getEnrollments = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === "student") {
    filter.student = req.user._id;
  }

  const enrollments = await Enrollment.find(filter)
    .populate("student", "name email")
    .populate("course", "title description price");

  res.status(200).json({
    success: true,
    count: enrollments.length,
    enrollments,
  });
});
