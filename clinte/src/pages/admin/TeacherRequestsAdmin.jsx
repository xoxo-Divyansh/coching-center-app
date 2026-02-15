import { useEffect, useState } from "react";
import {
  getTeacherRequests,
  reviewTeacherRequest,
} from "@/services/teacherRequest.service";

const TeacherRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getTeacherRequests();
      setRequests(res.data?.requests || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await reviewTeacherRequest(id, status);
      await loadRequests();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update request.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <div className="text-zinc-300">Loading teacher requests...</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Teacher Role Requests</h1>
      <p className="text-zinc-400 mb-6">
        Review and approve or reject student teacher requests.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300">
            No teacher requests found.
          </div>
        ) : (
          requests.map((req) => (
            <article
              key={req._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {req.user?.name || "Unknown user"}
                  </h2>
                  <p className="text-sm text-zinc-400">{req.user?.email}</p>
                  <p className="text-sm mt-2">
                    <span className="text-zinc-400">Status:</span>{" "}
                    <span className="capitalize">{req.status}</span>
                  </p>
                </div>
              </div>

              <p className="mt-4 text-zinc-200">{req.reason}</p>

              {req.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleReview(req._id, "approved")}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(req._id, "rejected")}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default TeacherRequestsAdmin;
