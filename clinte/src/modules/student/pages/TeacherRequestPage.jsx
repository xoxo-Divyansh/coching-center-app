import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import {
  getMyTeacherRequest,
  submitTeacherRequest,
} from "@/services/teacherRequest.service";

const TeacherRequestPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [reason, setReason] = useState("");
  const [request, setRequest] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await getMyTeacherRequest();
      const currentRequest = res.data?.request || null;
      setRequest(currentRequest);

      if (currentRequest?.status === "approved") {
        await refreshUser();
        setMessage("Your teacher request has been approved.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load request status.");
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!reason.trim()) {
      setError("Please enter a reason for your teacher request.");
      return;
    }

    try {
      setLoading(true);
      const res = await submitTeacherRequest({ reason: reason.trim() });
      setMessage(res.data?.message || "Teacher request submitted.");
      setReason("");
      await loadStatus();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (loadingStatus) {
      return <p className="text-zinc-400">Loading request status...</p>;
    }

    if (!request) {
      return (
        <p className="text-zinc-300">
          You have not submitted any teacher role request yet.
        </p>
      );
    }

    if (request.status === "approved") {
      return (
        <div className="space-y-3">
          <p className="text-green-400 font-medium">
            Request approved. Your role is now upgraded to teacher.
          </p>
          <button
            type="button"
            onClick={() => navigate("/teacher")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg font-semibold"
          >
            Go To Teacher Panel
          </button>
        </div>
      );
    }

    if (request.status === "pending") {
      return (
        <p className="text-amber-300">
          Your request is pending admin review. You will be updated once reviewed.
        </p>
      );
    }

    return (
      <p className="text-red-300">
        Your previous request was rejected. You can update your reason and
        submit again.
      </p>
    );
  };

  const canSubmit = !request || request.status === "rejected";

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Request Teacher Role</h1>
      <p className="text-zinc-400 mb-6">
        Send a request to admin to upgrade your role from student to teacher.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-2">Current Request Status</h2>
        {renderStatus()}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Write why you should get teacher access..."
          rows={5}
          className="w-full rounded-lg bg-zinc-800 p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : request?.status === "rejected" ? "Re-submit Request" : "Submit Request"}
        </button>
      </form>
    </section>
  );
};

export default TeacherRequestPage;
