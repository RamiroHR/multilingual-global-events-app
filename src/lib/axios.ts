import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/features/authSlice";
import ROUTES from "@/lib/routes/routes";

// Create axios instance
const axiosInstance = axios.create();

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration (do not reshed)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config.url !== ROUTES.LOGIN &&
      error.config.url !== ROUTES.SIGNUP
    ) {
      store.dispatch(logout()); // Clear auth state from RTK store
      localStorage.removeItem("token"); // Clear token stored
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
