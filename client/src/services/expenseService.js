import { api } from './api';
export const getExpenses = async (groupId) => (await api('/api/expenses')).expenses.filter((expense) => String(expense.group?._id || expense.group) === String(groupId));
export const createExpense = (body) => api('/api/expenses', { method: 'POST', body: JSON.stringify(body) });
