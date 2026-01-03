'use client';

import axios, { AxiosError } from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth-token';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

let isRefreshing = false;
let queue: PendingRequest[] = [];

function processQueue(error: unknown, token: string | null) {
  for (const item of queue) {
    if (token) {
      item.resolve(token);
    } else {
      item.reject(error);
    }
  }
  queue = [];
}

api.interceptors.request.use((config) => {
  if (config.skipAuth) return config;

  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config;
    if (!original || original.skipRefresh || original.skipAuth) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        original._retry = true;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;
    original._retry = true;

    try {
      const refreshResponse = await fetch('/apis/auth/refresh', { method: 'POST' });
      if (!refreshResponse.ok) throw new Error('refresh_failed');

      const data = (await refreshResponse.json()) as { access?: string };
      if (!data.access) throw new Error('missing_access_token');

      setAccessToken(data.access);
      processQueue(null, data.access);

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
