import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001', // Update this to your json-server or backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
