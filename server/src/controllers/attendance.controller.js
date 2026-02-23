import * as service from "../services/attendance.service.js";

export const markAttendance = async (req, res) => {
  const data = await service.markAttendance({
    ...req.body,
    markedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Attendance marked successfully",
    data,
  });
};

export const getBatchAttendance = async (req, res) => {
  const data = await service.getBatchAttendance(req.params.id);

  res.json({ success: true, data });
};
