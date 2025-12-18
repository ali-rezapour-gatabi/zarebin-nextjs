import axios from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: baseURL + '/',
  timeout: 15000,
});
