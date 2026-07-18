import { createContext, useContext, useState } from "react";
import {
  getPapers,
  uploadPaper as apiUploadPaper,
  deletePaper as apiDeletePaper,
} from "../services/paper.service";

const PaperContext = createContext();

export const PaperProvider = ({ children }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePaper, setActivePaper] = useState(null);

  const fetchPapers = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPapers(projectId);
      setPapers(data.data || []);
      if (activePaper) {
        const updatedActive = (data.data || []).find(p => p._id === activePaper._id);
        if (updatedActive) setActivePaper(updatedActive);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch papers.");
    } finally {
      setLoading(false);
    }
  };

  const uploadPaper = async (projectId, file, title) => {
    setError(null);
    try {
      const result = await apiUploadPaper(projectId, file, title);
      const newPaper = result.data;
      setPapers((prev) => [newPaper, ...prev]);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload paper.");
      throw err;
    }
  };

  const deletePaper = async (id) => {
    setError(null);
    try {
      await apiDeletePaper(id);
      setPapers((prev) => prev.filter((paper) => paper._id !== id));
      if (activePaper && activePaper._id === id) {
        setActivePaper(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete paper.");
      throw err;
    }
  };

  return (
    <PaperContext.Provider
      value={{
        papers,
        loading,
        error,
        activePaper,
        setActivePaper,
        fetchPapers,
        uploadPaper,
        deletePaper,
        setPapers, // Allow manual state update if needed (e.g., polling)
      }}
    >
      {children}
    </PaperContext.Provider>
  );
};

export const usePapers = () => useContext(PaperContext);
