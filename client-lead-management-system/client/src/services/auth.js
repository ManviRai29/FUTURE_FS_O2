import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_admin', JSON.stringify(data.admin));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_admin');
};

export const getCurrentAdmin = () => {
  const stored = localStorage.getItem('crm_admin');
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem('crm_token'));
};
