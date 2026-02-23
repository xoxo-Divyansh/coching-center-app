import Attendance from "../models/Attendance.js";
import Batch from "../models/Batch.js";
import ApiError from "../utils/apiError.js";

// Mark attendance for a batch on a date
export const markAttendance = async ({ batchId, date, records }) => {
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new ApiError("Batch not found", 404);
  }

  // Check duplicate attendance for same date
  const exists = await Attendance.findOne({ batch: batchId, date });
  if (exists) {
    throw new ApiError("Attendance already marked for this date", 400);
  }

  const attendance = await Attendance.create({
    batch: batchId,
    date,
    records,
  });

  return attendance;
};

// Get batch attendance report
export const getBatchAttendance = async (batchId) => {
  const attendance = await Attendance.find({ batch: batchId })
    .populate("records.student", "name email")
    .sort({ date: -1 });

  return attendance;
};

// Get student attendance report
export const getStudentAttendance = async (studentId) => {
  const attendance = await Attendance.find({
    "records.student": studentId,
  })
    .populate("batch", "name")
    .sort({ date: -1 });

  return attendance;
};
