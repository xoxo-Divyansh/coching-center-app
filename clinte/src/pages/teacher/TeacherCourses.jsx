import { useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/services/course.service";

const defaultForm = {
  title: "",
  description: "",
  price: "",
  duration: "",
  level: "beginner",
};

const TeacherCourses = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editCourseId, setEditCourseId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCourses({ page: 1, limit: 200 });
      setCourses(res.data?.course || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const ownCourses = useMemo(() => {
    if (user?.role === "admin") return courses;
    return courses.filter((course) => course.createdBy?._id === user?._id);
  }, [courses, user?._id, user?.role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: form.duration.trim(),
        level: form.level,
      };

      if (editCourseId) {
        await updateCourse(editCourseId, payload);
        setMessage("Course updated.");
      } else {
        await createCourse(payload);
        setMessage("Course created.");
      }

      setForm(defaultForm);
      setEditCourseId(null);
      await loadCourses();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (course) => {
    setEditCourseId(course._id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price ?? "",
      duration: course.duration || "",
      level: course.level || "beginner",
    });
    setMessage("");
    setError("");
  };

  const onDelete = async (courseId) => {
    const ok = window.confirm("Delete this course permanently?");
    if (!ok) return;
    try {
      setError("");
      setMessage("");
      await deleteCourse(courseId);
      setMessage("Course deleted.");
      await loadCourses();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete course.");
    }
  };

  const onCancelEdit = () => {
    setEditCourseId(null);
    setForm(defaultForm);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Teacher Course Management</h1>
      <p className="text-zinc-400 mb-6">
        Create and manage your courses from one place.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-300">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5 text-zinc-200">
          {message}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Course title"
          required
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
        />
        <input
          value={form.duration}
          onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
          placeholder="Duration (e.g. 3 months)"
          required
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
        />
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Description"
          required
          rows={4}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 md:col-span-2"
        />
        <input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          placeholder="Price"
          required
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
        />
        <select
          value={form.level}
          onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
        >
          <option value="beginner">beginner</option>
          <option value="intermediate">intermediate</option>
          <option value="advanced">advanced</option>
        </select>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : editCourseId ? "Update Course" : "Create Course"}
          </button>
          {editCourseId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="border border-zinc-600 hover:bg-zinc-800 px-4 py-2 rounded-lg font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="font-semibold mb-4">My Courses</h2>
        {loading ? (
          <p className="text-zinc-400 text-sm">Loading courses...</p>
        ) : ownCourses.length === 0 ? (
          <p className="text-zinc-400 text-sm">No courses found.</p>
        ) : (
          <div className="space-y-3">
            {ownCourses.map((course) => (
              <div
                key={course._id}
                className="border border-zinc-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-zinc-400 text-sm capitalize">
                    {course.level} | {course.duration} | INR {course.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(course)}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(course._id)}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeacherCourses;
