import { api } from './api';
export const getSettlements = (groupId) => api(`/api/settlements/group/${groupId}`);
export const createSettlement = (body) => api('/api/settlements', { method: 'POST', body: JSON.stringify(body) });
export const completeSettlement = (id) => api(`/api/settlements/${id}/complete`, { method: 'PATCH' });
