import { useCallback, useEffect, useState } from "react";
import {
  getTeacherRequests,
  reviewTeacherRequest,
} from "@/services/teacherRequest.service";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const TeacherRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const loadRequests = useCallback(async (nextPage = 1) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await getTeacherRequests({
        q: debouncedSearch,
        status: statusFilter,
        page: nextPage,
        limit,
      });
      setRequests(res.data?.requests || []);
      setPage(res.data?.page || nextPage);
      setPages(res.data?.pages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, limit, statusFilter]);

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
      await loadRequests(page);
    } catch (err) {
      setRequests(previousRequests);
      setError(err?.response?.data?.message || "Failed to update request.");
    }
  };

  useEffect(() => {
    loadRequests(1);
  }, [loadRequests]);

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
          onClick={() => loadRequests(page)}
          className="border border-zinc-600 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

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

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        <p>
          Showing page {page} of {pages} ({total} total requests)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRequests(Math.max(page - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded border border-zinc-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => loadRequests(Math.min(page + 1, pages))}
            disabled={page >= pages}
            className="px-3 py-1.5 rounded border border-zinc-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeacherRequestsAdmin;
