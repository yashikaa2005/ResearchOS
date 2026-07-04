// client/src/services/auth.service.js
import api from "./api";

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};