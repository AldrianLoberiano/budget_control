import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  config.metadata = { startTime: Date.now() };
  return config;
});

API.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;
    const status = response.status;
    console.log(`%c${method} %c${url} %c${status} %c${duration}ms`, 'color:#10b981;font-weight:bold', 'color:#6b7280', 'color:#10b981;font-weight:bold', 'color:#9ca3af');

    // Emit custom event for UI status bar
    window.dispatchEvent(new CustomEvent('api-status', {
      detail: { method, url, status, duration, success: true }
    }));
    return response;
  },
  (error) => {
    const duration = Date.now() - (error.config?.metadata?.startTime || Date.now());
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status || 'ERR';
    console.log(`%c${method} %c${url} %c${status} %c${duration}ms`, 'color:#ef4444;font-weight:bold', 'color:#6b7280', 'color:#ef4444;font-weight:bold', 'color:#9ca3af');

    window.dispatchEvent(new CustomEvent('api-status', {
      detail: { method, url, status, duration, success: false }
    }));

    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
