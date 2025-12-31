import axios, { AxiosInstance } from 'axios';

export const baseURL = 'http://localhost:3000/api/';

function createApi(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message || error?.response?.data?.detail || error.message || 'Network error';

      return Promise.reject({
        status: error?.response?.status,
        message,
        raw: error,
      });
    },
  );

  return instance;
}

export const api = createApi(baseURL);
