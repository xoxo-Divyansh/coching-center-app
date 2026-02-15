import { useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { getCourses, getCourseStudents } from "@/services/course.service";
import {
  getEnrollments,
  updateEnrollmentStatus,
} from "@/services/enrollment.service";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState({});

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      setError("");

      const [coursesRes, enrollmentsRes] = await Promise.all([
        getCourses({ page: 1, limit: 100 }),
        getEnrollments(),
      ]);

      const allCourses = coursesRes.data?.course || [];
      const scopedCourses =
        user?.role === "admin"
          ? allCourses
          : allCourses.filter(
              (course) => course.createdBy?._id === user?._id,
            );

      const scopedEnrollments = enrollmentsRes.data?.enrollments || [];

      setCourses(scopedCourses);
      setEnrollments(scopedEnrollments);

      const studentCountPairs = await Promise.all(
        scopedCourses.map(async (course) => {
          try {
            const res = await getCourseStudents(course._id);
            return [course._id, res.data?.totalStudents || 0];
          } catch {
            return [course._id, 0];
          }
        }),
      );

      setStudentsByCourse(Object.fromEntries(studentCountPairs));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load teacher data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [user?._id, user?.role]);

  const completedCount = useMemo(
    () =>
      enrollments.filter((enrollment) => enrollment.status === "completed")
        .length,
    [enrollments],
  );

  const handleStatusUpdate = async (enrollmentId, status) => {
    try {
      setMessage("");
      await updateEnrollmentStatus(enrollmentId, status);
      setMessage("Enrollment status updated.");
      await loadTeacherData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-zinc-300">Loading teacher dashboard...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Teacher Panel</h1>
      <p className="text-zinc-400">
        Manage courses and student enrollments from one place.
      </p>

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Courses Managed</p>
          <p className="text-2xl font-bold mt-1">{courses.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Total Enrollments</p>
          <p className="text-2xl font-bold mt-1">{enrollments.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-sm">Completed</p>
          <p className="text-2xl font-bold mt-1">{completedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-zinc-400 text-sm">No courses found.</p>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-zinc-800 rounded-lg p-3"
                >
                  <p className="font-medium">{course.title}</p>
                  <p className="text-zinc-400 text-sm">
                    {course.level} | {course.duration} | INR {course.price}
                  </p>
                  <p className="text-sm text-zinc-300 mt-1">
                    Students: {studentsByCourse[course._id] ?? 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Enrollment Management</h2>
          {enrollments.length === 0 ? (
            <p className="text-zinc-400 text-sm">No enrollments available.</p>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="border border-zinc-800 rounded-lg p-3"
                >
                  <p className="font-medium">
                    {enrollment.student?.name || "Unknown Student"}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {enrollment.student?.email}
                  </p>
                  <p className="text-zinc-300 text-sm mt-1">
                    Course: {enrollment.course?.title || "N/A"}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <select
                      defaultValue={enrollment.status}
                      onChange={(e) =>
                        handleStatusUpdate(enrollment._id, e.target.value)
                      }
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="enrolled">Enrolled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className="text-xs text-zinc-400">
                      Current: {enrollment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherDashboard;
