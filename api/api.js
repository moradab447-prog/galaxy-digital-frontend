'use client';

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

// Intercepteur pour ajouter le token
API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('galaxy_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Intercepteur pour gérer les erreurs 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('galaxy_token');
            }
        }
        return Promise.reject(error);
    }
);

export default API;
