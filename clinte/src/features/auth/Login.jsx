import { useState } from "react";
import { loginUser } from "../../services/auth.service";
import useAuth from "../../hooks/useAuth";



const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await loginUser(form);
    login(res.data.user);
    alert("Login successful");
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Login failed";

    alert(message);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
