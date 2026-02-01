import * as courseService from "../services/course.service.js";
import asyncHandler from "../utils/asyncHandler.js";

// ✅ Create course
export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourseService({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// ✅ Get all courses (with pagination)
export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await courseService.getAllCoursesService({
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    ...result,
  });
});

// ✅ Get single course
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseByIdService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Course fetched successfully",
    data: course,
  });
});

// ✅ Update course
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourseService(
    req.params.id,
    req.body,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

// ✅ Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourseService(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// ✅ Get students of a course
export const getCourseStudents = asyncHandler(async (req, res) => {
  const result = await courseService.getCourseStudentsService(
    req.params.id,
    req.user
  );

  res.status(200).json({
    success: true,
    message: "Course students fetched successfully",
    ...result,
  });
});
