import { useState } from "react";
import { submitTeacherRequest } from "@/services/teacherRequest.service";

const TeacherRequestPage = () => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Request Teacher Role</h1>
      <p className="text-zinc-400 mb-6">
        Send a request to admin to upgrade your role from student to teacher.
      </p>

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
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
};

export default TeacherRequestPage;
