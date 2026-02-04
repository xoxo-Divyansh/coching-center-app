// services/authApi.js
import api from "./axios";

export const loginUser = (data) =>
  api.post("/auth/login", data);
