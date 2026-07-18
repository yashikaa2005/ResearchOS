import api from "./api";

export const getNotes = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/notes`);
  return response.data;
};

export const createNote = async (projectId, data) => {
  const response = await api.post(`/projects/${projectId}/notes`, data);
  return response.data;
};

export const updateNote = async (id, data) => {
  const response = await api.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};
