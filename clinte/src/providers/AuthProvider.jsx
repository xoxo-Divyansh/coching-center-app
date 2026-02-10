import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getProfile } from "../services/auth.service";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log("AuthProvider mounted")
  const [loading, setLoading] = useState(true);
  
  console.log("User:", user, "Loading:", loading)
  const login = (token, user) => {
    localStorage.setItem("token",token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  };

  try {
    const res = await getProfile();
    setUser(res.data.user);
  } catch (err) {
    if (err?.response?.status === 401) {
      logout();
    } else {
      console.error("Unexpected error while loading user:", err);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
