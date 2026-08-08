import { api } from './api';
export const getGroups = () => api('/api/groups');
export const createGroup = (body) => api('/api/groups', { method: 'POST', body: JSON.stringify(body) });
export const getGroup = (id) => api(`/api/groups/${id}`);
export const getMembers = (id) => api(`/api/groups/${id}/members`);
export const addMember = (id, email) => api(`/api/groups/${id}/members`, { method: 'POST', body: JSON.stringify({ email }) });
export const removeMember = (id, memberId) => api(`/api/groups/${id}/members/${memberId}`, { method: 'DELETE' });
