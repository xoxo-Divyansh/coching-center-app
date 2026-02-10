// src/features/home/home.api.js
import axios from "@/services/axios";

export const getHomeStats = () => axios.get("/home/stats");