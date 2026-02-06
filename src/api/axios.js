import axios from 'axios';

const API = axios.create({
    baseURL: 'https://money-manager-backend-l19d.onrender.com', // Your backend URL
});

// Automatically add the JWT token to headers if it exists
API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null;
    
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default API;