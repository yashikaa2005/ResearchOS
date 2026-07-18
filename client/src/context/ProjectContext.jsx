
import { createContext, useContext, useState, useEffect } from "react";
import {
  getProjects,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/project.service";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext(); //creates empty global box

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); //is api running
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const createProject = async (projectData) => {
    setError(null);
    try {
      const result = await createProjectService(projectData);
      await fetchProjects();
      return result;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create project."
      );
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    setError(null);
    try {
      const result = await updateProjectService(id, projectData);
      await fetchProjects();
      return result;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update project."
      );
      throw err;
    }
  };

  const deleteProject = async (id) => {
    setError(null);
    try {
      const result = await deleteProjectService(id);
      await fetchProjects();
      return result;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete project."
      );
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);