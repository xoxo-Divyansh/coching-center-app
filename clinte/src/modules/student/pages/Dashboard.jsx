import useAuth from "@/hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getEnrollments } from "@/services/enrollment.service";
import { getCourses } from "@/services/course.service";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadDashboard = useCallback(async () => {
    if (!user || user.role !== "student") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [enrollmentsRes, coursesRes] = await Promise.all([
        getEnrollments(),
        getCourses({ page: 1, limit: 100 }),
      ]);

      setEnrollments(enrollmentsRes.data?.enrollments || []);
      setCourses(coursesRes.data?.course || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const enrolledCourseIds = useMemo(() => {
    return new Set(
      enrollments
        .map((enrollment) => enrollment.course?._id)
        .filter(Boolean),
    );
  }, [enrollments]);

  const availableCourses = useMemo(() => {
    return courses.filter((course) => !enrolledCourseIds.has(course._id));
  }, [courses, enrolledCourseIds]);

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter(
    (enrollment) => enrollment.status === "completed",
  ).length;
  const activeCount = enrollments.filter(
    (enrollment) => enrollment.status === "enrolled",
  ).length;

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-zinc-300">Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-400">
        Welcome {user?.name || "User"} ({user?.role || "guest"}).
      </p>

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
          {error}
        </div>
      )}

      {user?.role !== "student" ? (
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-300">
          Student analytics are available only for student accounts.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-400 text-sm">My Enrollments</p>
              <p className="text-2xl font-bold mt-1">{enrolledCount}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-400 text-sm">Active Courses</p>
              <p className="text-2xl font-bold mt-1">{activeCount}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-400 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1">{completedCount}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-400 text-sm">Available Courses</p>
              <p className="text-2xl font-bold mt-1">{availableCourses.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="font-semibold mb-4">My Enrolled Courses</h2>
              {enrollments.length === 0 ? (
                <p className="text-zinc-400 text-sm">You are not enrolled in any course yet.</p>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="border border-zinc-800 rounded-lg p-3"
                    >
                      <p className="font-medium">
                        {enrollment.course?.title || "Untitled Course"}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Duration: {enrollment.course?.duration || "N/A"} | Price:{" "}
                        {enrollment.course?.price ?? 0}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{" "}
                        <span className="capitalize text-zinc-300">
                          {enrollment.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="font-semibold mb-4">Courses You Can Explore</h2>
              {availableCourses.length === 0 ? (
                <p className="text-zinc-400 text-sm">
                  No additional courses available right now.
                </p>
              ) : (
                <div className="space-y-3">
                  {availableCourses.slice(0, 8).map((course) => (
                    <div key={course._id} className="border border-zinc-800 rounded-lg p-3">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-zinc-400 text-sm">
                        {course.level} | {course.duration} | {course.price}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
