import { api } from './api';
export const login = (body) => api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const register = (body) => api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const getMe = () => api('/api/auth/me');
