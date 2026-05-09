import API from './api';

export const getTasksByProject = async (projectId) => {
  const { data } = await API.get(`/tasks/project/${projectId}`);
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await API.post('/tasks', taskData);
  return data;
};

export const updateTask = async (id, taskData) => {
  const { data } = await API.put(`/tasks/${id}`, taskData);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await API.delete(`/tasks/${id}`);
  return data;
};

export const getStats = async () => {
  const { data } = await API.get('/tasks/stats');
  return data;
};
