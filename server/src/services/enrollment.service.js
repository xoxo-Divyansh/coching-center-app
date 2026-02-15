import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import ApiError from "../utils/apiError.js";

// ✅ Enroll student in course
export const enrollCourseService = async (courseId, user) => {
  if (user.role !== "student") {
    throw new ApiError("Only students can enroll in courses", 403);
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError("Invalid course ID", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  // ❌ Student cannot enroll in own course
  if (course.createdBy.toString() === user._id.toString()) {
    throw new ApiError("You cannot enroll in your own course", 400);
  }

  // ❌ Prevent duplicate enrollment
  const alreadyEnrolled = await Enrollment.findOne({
    student: user._id,
    course: courseId,
  });

  if (alreadyEnrolled) {
    throw new ApiError("Already enrolled in this course", 400);
  }

  const enrollment = await Enrollment.create({
    student: user._id,
    course: courseId,
  });

  return enrollment;
};

// ✅ Get enrollments (role-based)
export const getEnrollmentsService = async (user) => {
  let filter = {};

  if (user.role === "student") {
    filter.student = user._id;
  }

  const enrollments = await Enrollment.find(filter)
    .populate("student", "name email")
    .populate("course", "title price duration");

  return enrollments;
};

// ✅ Update enrollment status (admin / course creator)
export const updateEnrollmentStatusService = async (
  enrollmentId,
  status,
  user
) => {
  if (!["enrolled", "completed", "cancelled"].includes(status)) {
    throw new ApiError("Invalid enrollment status", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
    throw new ApiError("Invalid enrollment ID", 400);
  }

  const enrollment = await Enrollment.findById(enrollmentId).populate("course");
  if (!enrollment) {
    throw new ApiError("Enrollment not found", 404);
  }

  // 🔐 Authorization
  if (
    user.role !== "admin" &&
    enrollment.course.createdBy.toString() !== user._id.toString()
  ) {
    throw new ApiError("Not authorized to update enrollment", 403);
  }

  enrollment.status = status;
  await enrollment.save();

  return enrollment;
};
