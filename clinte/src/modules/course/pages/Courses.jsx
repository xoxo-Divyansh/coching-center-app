import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { enrollInCourse, getCourses } from "@/services/course.service";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCourses({ page: 1, limit: 100 });
      setCourses(res.data?.course || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setActionMsg("");
      await enrollInCourse(courseId);
      setActionMsg("Enrollment successful.");
    } catch (err) {
      setActionMsg(err?.response?.data?.message || "Enrollment failed.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Courses</h1>
      <p className="text-zinc-400 mb-8">
        Explore coaching courses and enroll as a student.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300">
          {error}
        </div>
      )}

      {actionMsg && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 text-zinc-200">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <p className="text-zinc-300">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-300">
          No courses available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => (
            <article
              key={course._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-zinc-400 text-sm mt-1 capitalize">
                {course.level} | {course.duration}
              </p>
              <p className="text-zinc-300 mt-4 flex-1">{course.description}</p>
              <p className="text-lg font-bold mt-4">INR {course.price}</p>

              <div className="mt-4">
                {user?.role === "student" ? (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
                  >
                    Enroll Now
                  </button>
                ) : user ? (
                  <p className="text-sm text-zinc-400">
                    Enrollment is available for student accounts.
                  </p>
                ) : (
                  <Link
                    to="/auth/login"
                    className="inline-block w-full text-center border border-purple-500 hover:bg-purple-500/10 px-4 py-2 rounded-lg font-semibold"
                  >
                    Login to Enroll
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Courses;
