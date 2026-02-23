import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "@/ui/Button";
import {
  getAllStudents,
  addStudentsToBatch,
} from "@/services/batch.service";

const AssignStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (err) {
      console.error("fetchStudents error:", err);
      toast.error("Failed to load students");
    }
  };

  const toggleStudent = (sid) => {
    setSelected((prev) =>
      prev.includes(sid)
        ? prev.filter((x) => x !== sid)
        : [...prev, sid]
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) {
      return toast.error("Select at least one student");
    }

    try {
      setLoading(true);
      await addStudentsToBatch(id, selected);
      toast.success("Students assigned successfully");
      navigate("/admin/batches");
    } catch (err) {
      console.error("assignStudents error:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Assignment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">
        Assign Students To Batch
      </h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(s._id)}
                    onChange={() => toggleStudent(s._id)}
                  />
                </td>
                <td className="px-4 py-2">
                  {s.name || s.fullName}
                </td>
                <td className="px-4 py-2">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/batches")}
        >
          Cancel
        </Button>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Assigning..." : "Assign Students"}
        </Button>
      </div>
    </div>
  );
};

export default AssignStudents;
