import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://chatapp-q4ke.onrender.com/api",
  withCredentials: true,
});
