import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const RoleGuard = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  return allowedRoles.includes(user?.role)
    ? <Outlet />
    : <Navigate to="/" replace />;
};

RoleGuard.propTypes = {
  allowedRoles: (props, propName, componentName) => {
    const value = props[propName];
    if (!Array.isArray(value) || value.some((role) => typeof role !== "string")) {
      return new Error(
        `${componentName} requires '${propName}' to be an array of role strings.`,
      );
    }
    return null;
  },
};

export default RoleGuard;
