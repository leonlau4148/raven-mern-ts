import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiError } from '../types';

// One configured HTTP client for the whole app — same idea as a
// shared dio instance in Flutter.
// VITE_API_URL lets us point at the deployed server later without
// touching code (Vite exposes env vars prefixed with VITE_).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor — the dio Interceptor equivalent.
// Runs before EVERY request and attaches the JWT if we have one,
// so no page ever sets the Authorization header manually.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Pulls the server's error message out of an unknown thrown value.
 * `catch` gives us `unknown` under strict mode, so every page needs this
 * narrowing step before it can read `err.response.data.message`.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  const axiosError = err as AxiosError<ApiError>;
  return axiosError?.response?.data?.message || fallback;
}

/** True when the server rejected our token (expired or invalid). */
export function isUnauthorized(err: unknown): boolean {
  return (err as AxiosError)?.response?.status === 401;
}

export default api;
