import API from './api';

export const login = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const signup = async (userData) => {
  const { data } = await API.post('/auth/signup', userData);
  return data;
};

export const logout = async () => {
  const { data } = await API.post('/auth/logout');
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get('/auth/profile');
  return data;
};
