import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/ui/Button";
import { getTeacherBatches } from "@/services/batch.service";
import { getBatchStudents, markAttendance } from "@/services/attendance.service";

const Attendance = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState({});

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getTeacherBatches();
      setBatches(data || []);
    } catch (err) {
      console.error("fetchBatches error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load batches"
      );
    }
  };

  const fetchStudents = async (id) => {
    try {
      const data = await getBatchStudents(id);
      setStudents(data || []);

      const initial = {};
      data.forEach((s) => {
        initial[s._id] = "present";
      });
      setRecords(initial);
    } catch (err) {
      console.error("fetchStudents error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load students"
      );
    }
  };

  const toggleStatus = (id) => {
    setRecords((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
  };

  const handleSubmit = async () => {
    if (!batchId) return toast.error("Select a batch");
    if (!students.length) return toast.error("No students found");

    const payload = {
      batchId,
      date,
      records: Object.entries(records).map(([student, status]) => ({
        student,
        status,
      })),
    };

    try {
      setLoading(true);
      await markAttendance(payload);
      toast.success("Attendance saved successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Attendance failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow text-zinc-100">
      <h1 className="text-2xl font-semibold mb-6">Mark Attendance</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-300">Batch</label>
          <select
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
              fetchStudents(e.target.value);
            }}
            className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {batches.length === 0 && (
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
          No batches assigned yet. Ask admin to assign you to a batch.
        </div>
      )}

      {students.length > 0 && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="text-left px-4 py-2">Student</th>
                <th className="text-center px-4 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t border-zinc-800">
                  <td className="px-4 py-2">
                    {s.name || s.fullName || s.email}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleStatus(s._id)}
                      className={`px-4 py-1 rounded-full text-white ${
                        records[s._id] === "present"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {records[s._id]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
};

export default Attendance;
