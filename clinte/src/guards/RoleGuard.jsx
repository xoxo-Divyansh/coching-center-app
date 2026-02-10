import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const RoleGuard = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  return allowedRoles.includes(user?.role)
    ? <Outlet />
    : <Navigate to="/" replace />;
};

export default RoleGuard;