import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "@/ui/Button";
import { getAllBatches } from "@/services/batch.service";

const BatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getAllBatches();
      setBatches(data || []);
    } catch (err) {
      console.error("fetchBatches error:", err);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading batches...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Batches</h1>
        <Button onClick={() => navigate("/admin/batches/create")}>
          + Create Batch
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Teacher</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">{b.course?.title}</td>
                <td className="px-4 py-2">
                  {b.teacher?.name || "Not Assigned"}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/batches/${b._id}/assign`)
                    }
                  >
                    Assign Students
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchList;
