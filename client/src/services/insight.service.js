import api from "./api";

export const getProjectInsights = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/insights`);
  return response.data;
};

export const getKnowledgeGraph = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/graph`);
  return response.data;
};

export const getProjectActivities = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/activities`);
  return response.data;
};

export const getGlobalActivities = async () => {
  const response = await api.get("/activities");
  return response.data;
};

export const searchWorkspace = async (projectId, query) => {
  const response = await api.get(`/projects/${projectId}/search`, {
    params: { q: query },
  });
  return response.data;
};
