import api from "./axios";

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  api.get('auth/me');
}

export const logoutUser = () => {
  api.post("/auth/logout")
}