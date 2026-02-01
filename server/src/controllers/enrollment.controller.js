import asyncHandler from "../utils/asyncHandler.js";
import * as enrollmentService from "../services/enrollment.service.js";

// ➕ Enroll in course
export const enrollCourse = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollCourseService(
    req.body.courseId,
    req.user
  );

  res.status(201).json({
    success: true,
    message: "Enrolled successfully",
    enrollment,
  });
});

// 📚 Get enrollments
export const getEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getEnrollmentsService(req.user);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    enrollments,
  });
});

// 🔄 Update enrollment status
export const updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentStatusService(
    req.params.id,
    req.body.status,
    req.user
  );

  res.status(200).json({
    success: true,
    enrollment,
  });
});
