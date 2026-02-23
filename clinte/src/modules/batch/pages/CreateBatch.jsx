import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { createBatch } from "@/services/batch.service";
import { getCourses } from "@/services/course.service";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateBatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course: "",
    schedule: {
      days: [],
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses({ page: 1, limit: 200 });
        setCourses(res.data?.course || []);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("schedule.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [key]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists = prev.schedule.days.includes(day);
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          days: exists
            ? prev.schedule.days.filter((d) => d !== day)
            : [...prev.schedule.days, day],
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createBatch(form);
      navigate("/admin/batches");
    } catch (error) {
      console.error("Create batch failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Create New Batch</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Batch Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Morning Physics Batch"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-lg border ${
                  form.schedule.days.includes(day)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="time"
            name="schedule.startTime"
            value={form.schedule.startTime}
            onChange={handleChange}
            required
          />
          <Input
            label="End Time"
            type="time"
            name="schedule.endTime"
            value={form.schedule.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/batches")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBatch;
