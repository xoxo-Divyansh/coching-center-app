import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
  


export const getAdminStatsService = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalCourses,
    totalEnrollments,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "admin" }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
  ]);

  return {
    users: totalUsers,
    students: totalStudents,
    teachers: totalTeachers,
    admins: totalAdmins,
    courses: totalCourses,
    enrollments: totalEnrollments,
  };
};

// 💰 Revenue Statistics Service
export const getRevenueStatsService = async () => {
  // 🔹 Total Revenue
  const totalRevenueAgg = await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    { $unwind: "$courseDetails" },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$courseDetails.price" },
        totalEnrollments: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
  const totalEnrollments = totalRevenueAgg[0]?.totalEnrollments || 0;

  // 🔹 Monthly Revenue (Current Year)
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = await Enrollment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    { $unwind: "$courseDetails" },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$courseDetails.price" },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // 🔹 Revenue by Course
  const revenueByCourse = await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    { $unwind: "$courseDetails" },
    {
      $group: {
        _id: "$courseDetails._id",
        title: { $first: "$courseDetails.title" },
        revenue: { $sum: "$courseDetails.price" },
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return {
    totalRevenue,
    totalEnrollments,
    monthlyRevenue,
    revenueByCourse,
  };
};