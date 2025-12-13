import axios from 'axios';
import authService from './authService';

const API_URL = '/api/v1/scan/';

// Configure axios with auth header
const axiosInstance = axios.create({
    baseURL: '', // Handled by proxy
});

axiosInstance.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Scan Barcode
const scanBarcode = async (barcode) => {
    const response = await axiosInstance.post(API_URL, { barcode });
    return response.data;
};

// Get History
const getHistory = async () => {
    const response = await axiosInstance.get(API_URL + 'history');
    return response.data;
};

const scanService = {
    scanBarcode,
    getHistory,
};

export default scanService;
