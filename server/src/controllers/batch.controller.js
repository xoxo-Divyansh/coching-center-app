import * as batchService from "../services/batch.service.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";

/**
 * @desc    Create new batch
 * @route   POST /api/batches
 * @access  Admin
 */
export const createBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.createBatch(req.body);

  res.status(201).json(
    new ApiResponse(201, batch, "Batch created successfully")
  );
});

/**
 * @desc    Assign teacher to batch
 * @route   PATCH /api/batches/:id/assign-teacher
 * @access  Admin
 */
export const assignTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { teacherId } = req.body;

  const batch = await batchService.assignTeacher(id, teacherId);

  res.status(200).json(
    new ApiResponse(200, batch, "Teacher assigned successfully")
  );
});

/**
 * @desc    Add students to batch
 * @route   PATCH /api/batches/:id/add-students
 * @access  Admin
 */
export const addStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { students } = req.body;

  const batch = await batchService.addStudents(id, students);

  res.status(200).json(
    new ApiResponse(200, batch, "Students added successfully")
  );
});

/**
 * @desc    Get all batches (Admin)
 * @route   GET /api/batches
 * @access  Admin
 */
export const getAllBatches = asyncHandler(async (req, res) => {
  const batches = await batchService.getAllBatches();

  res.status(200).json(
    new ApiResponse(200, batches, "Batches fetched successfully")
  );
});

/**
 * @desc    Get my batches (Teacher)
 * @route   GET /api/batches/teacher/my
 * @access  Teacher
 */
export const getTeacherBatches = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const batches = await batchService.getTeacherBatches(teacherId);

  res.status(200).json(
    new ApiResponse(200, batches, "Teacher batches fetched successfully")
  );
});

/**
 * @desc    Get my batches (Student)
 * @route   GET /api/batches/student/my
 * @access  Student
 */
export const getStudentBatches = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const batches = await batchService.getStudentBatches(studentId);

  res.status(200).json(
    new ApiResponse(200, batches, "Student batches fetched successfully")
  );
});

/**
 * @desc    Get batch by id
 * @route   GET /api/batches/:id
 * @access  Admin | Teacher (assigned)
 */
export const getBatchById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const batch = await batchService.getBatchById(id);

  res.status(200).json(
    new ApiResponse(200, batch, "Batch fetched successfully")
  );
});

/**
 * @desc    Get batch students
 * @route   GET /api/batches/:id/students
 * @access  Admin | Teacher | Student
 */
export const getBatchStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const students = await batchService.getBatchStudents(id);

  res.status(200).json(
    new ApiResponse(200, students, "Batch students fetched successfully")
  );
});
