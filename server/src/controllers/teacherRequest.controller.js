import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import TeacherRequest from "../models/TeacherRequest.js";
import User from "../models/User.js";

// 🧑‍🎓 Student → Request teacher role
export const requestTeacherRole = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError("Reason is required", 400);
  }

  const exists = await TeacherRequest.findOne({ user: req.user._id });
  if (exists) {
    throw new ApiError("Request already submitted", 400);
  }

  const request = await TeacherRequest.create({
    user: req.user._id,
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Teacher request submitted",
    request,
  });
});

// 🛡 Admin → Get all teacher requests
export const getTeacherRequests = asyncHandler(async (req, res) => {
  const requests = await TeacherRequest.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

// ✅ Admin → Approve / Reject teacher request
export const reviewTeacherRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  const request = await TeacherRequest.findById(req.params.id);
  if (!request) throw new ApiError("Request not found", 404);

  request.status = status;
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();

  await request.save();

  // 🔥 Auto upgrade role
  if (status === "approved") {
    await User.findByIdAndUpdate(request.user, { role: "teacher" });
  }

  res.status(200).json({
    success: true,
    message: `Request ${status}`,
  });
});
