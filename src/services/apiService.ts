import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiService = axios.create({
    baseURL: API_URL,
    timeout: 15000,
});