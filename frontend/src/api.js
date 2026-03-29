// src/api.js
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:5000", // Flask backend ka URL
// });

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// 🔥 ADD THIS BELOW
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
