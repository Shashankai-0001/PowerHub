import axios from "axios";

const api = axios.create({
  baseURL: "https://powerhub-gmwx.onrender.com", // YOUR BACKEND URL
  withCredentials: false,
});

export default api;
