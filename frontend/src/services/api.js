import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Only logout if NOT login route
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Ignore auth check endpoint
    const isSessionCheck = url.includes('/auth/me');

    if (status === 401 && !isSessionCheck) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
);

export default api;
