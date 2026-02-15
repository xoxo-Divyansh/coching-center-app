import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getProfile } from "../services/auth.service";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  const login = (data) => {
    localStorage.setItem("token",data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
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
    refreshUser();
  }, []);

  useEffect(() => {
    const handleWindowFocus = () => {
      refreshUser();
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
