// Service Layer for Auth API Calls
import api from '../api';

// API_URL handled in ../api.js

// Register user
const register = async (userData) => {
    const response = await api.post('/api/v1/auth/register', userData);

    if (response.data) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await api.post('/api/v1/auth/login', userData);

    if (response.data) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Logout user
const logout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
    if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
    }
    return JSON.parse(sessionStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
