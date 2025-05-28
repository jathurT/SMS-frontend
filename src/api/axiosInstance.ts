import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: url, // Replace with your base URL
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json", // Set the Content-Type
  },
});

export default axiosInstance;
