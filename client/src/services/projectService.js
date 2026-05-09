import API from './api';

export const getProjects = async () => {
  const { data } = await API.get('/projects');
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await API.post('/projects', projectData);
  return data;
};

export const getProjectById = async (id) => {
  const { data } = await API.get(`/projects/${id}`);
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data } = await API.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await API.delete(`/projects/${id}`);
  return data;
};
