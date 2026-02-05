import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend ready hoga tab kaam aayega
  withCredentials: true,
});

export default api;
