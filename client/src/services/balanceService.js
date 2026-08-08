import { api } from './api';
export const getBalance = (groupId) => api(`/api/balance/${groupId}`);
