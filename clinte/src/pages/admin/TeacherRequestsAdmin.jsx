import { useEffect, useState } from "react";
import {
  getTeacherRequests,
  reviewTeacherRequest,
} from "@/services/teacherRequest.service";

const TeacherRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await getTeacherRequests();
      setRequests(res.data?.requests || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    const shouldProceed = window.confirm(
      `Are you sure you want to ${status} this teacher request?`,
    );
    if (!shouldProceed) return;

    const previousRequests = requests;
    setError("");
    setMessage("");

    // optimistic update
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id
          ? {
              ...req,
              status,
              reviewedAt: new Date().toISOString(),
            }
          : req,
      ),
    );

    try {
      await reviewTeacherRequest(id, status);
      setMessage(`Request ${status}.`);
      await loadRequests();
    } catch (err) {
      setRequests(previousRequests);
      setError(err?.response?.data?.message || "Failed to update request.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      req.user?.name?.toLowerCase().includes(query) ||
      req.user?.email?.toLowerCase().includes(query) ||
      req.reason?.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all" ? true : req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {message && <p className="text-green-400 text-sm mb-4">{message}</p>}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or reason"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={loadRequests}
          className="border border-zinc-600 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300">
            No teacher requests found.
          </div>
        ) : (
          filteredRequests.map((req) => (
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
                  <p className="text-xs text-zinc-500 mt-2">
                    Submitted:{" "}
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {req.reviewedAt && (
                    <p className="text-xs text-zinc-500">
                      Reviewed: {new Date(req.reviewedAt).toLocaleString()}
                    </p>
                  )}
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
