import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/auth-token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let queue: PendingRequest[] = [];

function processQueue(error: unknown, token: string | null) {
  queue.forEach((item) => (token ? item.resolve(token) : item.reject(error)));
  queue = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if ((config as any).skipAuth) return config;

  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!original || (original as any).skipRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    original._retry = true;

    try {
      const refreshResponse = await fetch('/apis/auth/refresh', { method: 'POST' });
      if (!refreshResponse.ok) throw new Error('refresh_failed');

      const data = (await refreshResponse.json()) as { access: string };
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
