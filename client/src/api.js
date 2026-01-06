import axios from "axios";

const api = axios.create({
  baseURL: "https://powerhub-gnwx.onrender.com", 
  withCredentials: false,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
