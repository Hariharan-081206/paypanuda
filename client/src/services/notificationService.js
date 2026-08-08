import { api } from './api';
export const getNotifications = () => api('/api/notifications');
export const getUnread = () => api('/api/notifications/unread');
export const readNotification = (id) => api(`/api/notifications/${id}/read`, { method: 'PATCH' });
export const readAll = () => api('/api/notifications/read-all', { method: 'PATCH' });
export const deleteNotification = (id) => api(`/api/notifications/${id}`, { method: 'DELETE' });
