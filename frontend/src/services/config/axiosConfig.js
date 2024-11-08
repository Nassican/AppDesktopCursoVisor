import axios from "axios";
import { config } from "../../config/environment";

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  timeout: config.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
