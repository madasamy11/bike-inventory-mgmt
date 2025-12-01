import axios from "axios";

const api = axios.create({ baseURL: "https://bike-inventory-mgmt.vercel.app/api/v1" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === "Invalid token") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.dispatchEvent(new CustomEvent("session-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;