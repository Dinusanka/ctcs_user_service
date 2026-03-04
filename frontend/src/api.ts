import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    timeout: 10000, // 10 seconds timeout
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        if (config.headers) {
            if (typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    }
    return config;
});

export default api;
