import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://lms0.onrender.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken") || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
