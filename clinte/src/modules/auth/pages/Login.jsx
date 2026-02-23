import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/auth.service";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const res = await loginUser(form);
      console.log("LOGIN USER:", res.data.user);
      login(res.data);
      
      const role = res.data.user.role;

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
   
     <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 m- rounded-xl w-96">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <input
        placeholder="Email"
        className="w-full mb-4 p-3 rounded bg-zinc-800"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        className="w-full mb-6 p-3 rounded bg-zinc-800"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="w-full py-3 bg-purple-600 rounded hover:bg-purple-700">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
   
  );
};

export default Login;
