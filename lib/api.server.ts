import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cookies, headers } from 'next/headers';

const baseURL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipRefresh?: boolean;
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  if (config.skipAuth) return config;

  const access = (await cookies()).get('access')?.value;
  if (access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return null;

  const proto = h.get('x-forwarded-proto') ?? 'http';
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/apis/auth/refresh`, {
    method: 'POST',
    cache: 'no-store',
    headers: { cookie: h.get('cookie') ?? '' },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { access?: string };
  return data.access ?? null;
}

export async function serverRequest<T = unknown>(config: AxiosRequestConfig) {
  try {
    return await api.request<T, AxiosResponse<T>>(config);
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;

    const original = err.config;
    const is401 = err.response?.status === 401;

    if (!original || !is401 || original._retry || original.skipAuth || original.skipRefresh) {
      throw err;
    }

    const newAccess = await refreshAccessToken();
    if (!newAccess) throw err;

    original._retry = true;
    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newAccess}`;

    return api.request<T, AxiosResponse<T>>(original);
  }
}

export default api;
