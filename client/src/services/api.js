const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const getToken = () => localStorage.getItem('expense_splitter_token');
export const setToken = (token) => localStorage.setItem('expense_splitter_token', token);
export const clearToken = () => localStorage.removeItem('expense_splitter_token');

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.message || 'Request failed.');
  return data;
}
