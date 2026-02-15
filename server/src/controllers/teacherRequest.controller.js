import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import TeacherRequest from "../models/TeacherRequest.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import {
  isNonEmptyString,
  isValidTeacherRequestFilterStatus,
  isValidTeacherRequestStatus,
} from "../utils/validators.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 🧑‍🎓 Student → Request teacher role
export const requestTeacherRole = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!isNonEmptyString(reason, 10)) {
    throw new ApiError("Reason must be at least 10 characters", 400);
  }
  const normalizedReason = reason.trim();

  const existingRequest = await TeacherRequest.findOne({ user: req.user._id });

  if (existingRequest?.status === "pending") {
    throw new ApiError("Request already submitted and pending review", 400);
  }

  if (existingRequest?.status === "approved") {
    throw new ApiError("Your request is already approved", 400);
  }

  if (existingRequest?.status === "rejected") {
    existingRequest.reason = normalizedReason;
    existingRequest.status = "pending";
    existingRequest.reviewedBy = undefined;
    existingRequest.reviewedAt = undefined;
    await existingRequest.save();

    return res.status(200).json({
      success: true,
      message: "Teacher request re-submitted",
      request: existingRequest,
    });
  }

  const request = await TeacherRequest.create({
    user: req.user._id,
    reason: normalizedReason,
  });

  res.status(201).json({
    success: true,
    message: "Teacher request submitted",
    request,
  });
});

// Student/Teacher/Admin -> Get own teacher request status
export const getMyTeacherRequest = asyncHandler(async (req, res) => {
  const request = await TeacherRequest.findOne({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    request: request || null,
  });
});

// 🛡 Admin → Get all teacher requests
export const getTeacherRequests = asyncHandler(async (req, res) => {
  const {
    q = "",
    status = "all",
    page: rawPage = "1",
    limit: rawLimit = "10",
  } = req.query;

  const page = Math.max(parseInt(rawPage, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(rawLimit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (!isValidTeacherRequestFilterStatus(status)) {
    throw new ApiError("Invalid status filter", 400);
  }
  if (status !== "all") {
    filter.status = status;
  }

  let requests = [];
  let total = 0;

  if (typeof q === "string" && q.trim()) {
    const searchRegex = new RegExp(escapeRegex(q.trim()), "i");

    const allFiltered = await TeacherRequest.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    const matched = allFiltered.filter(
      (item) =>
        item.user &&
        (searchRegex.test(item.user?.name || "") ||
          searchRegex.test(item.user?.email || "") ||
          searchRegex.test(item.reason || "")),
    );

    total = matched.length;
    requests = matched.slice(skip, skip + limit);
  } else {
    const [paged, totalRaw] = await Promise.all([
      TeacherRequest.find(filter)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      TeacherRequest.countDocuments(filter),
    ]);

    requests = paged;
    total = totalRaw;
  }

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
    requests,
  });
});

// ✅ Admin → Approve / Reject teacher request
export const reviewTeacherRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!isValidTeacherRequestStatus(status)) {
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

  await AuditLog.create({
    admin: req.user._id,
    action: "UPDATE",
    entity: "TeacherRequest",
    entityId: request._id,
    metadata: {
      requestUserId: request.user,
      status,
    },
  });

  res.status(200).json({
    success: true,
    message: `Request ${status}`,
  });
});
