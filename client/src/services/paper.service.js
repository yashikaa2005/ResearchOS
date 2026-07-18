import api from "./api";

export const getPapers = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/papers`);
  return response.data;
};

export const uploadPaper = async (projectId, file, title) => {
  const formData = new FormData();
  formData.append("pdf", file);
  if (title) formData.append("title", title);

  const response = await api.post(`/projects/${projectId}/papers`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePaper = async (id) => {
  const response = await api.delete(`/papers/${id}`);
  return response.data;
};
