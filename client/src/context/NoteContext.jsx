import { createContext, useContext, useState } from "react";
import {
  getNotes,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
} from "../services/note.service";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  const fetchNotes = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes(projectId);
      setNotes(data.data || []);
      // If activeNote is currently set, update it from the fresh notes list if found
      if (activeNote) {
        const updatedActive = (data.data || []).find(n => n._id === activeNote._id);
        if (updatedActive) setActiveNote(updatedActive);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (projectId, noteData) => {
    setError(null);
    try {
      const result = await apiCreateNote(projectId, noteData);
      const newNote = result.data;
      setNotes((prev) => [newNote, ...prev]);
      setActiveNote(newNote);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note.");
      throw err;
    }
  };

  const saveNote = async (id, noteData) => {
    setError(null);
    try {
      const result = await apiUpdateNote(id, noteData);
      const updatedNote = result.data;
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? updatedNote : note))
      );
      if (activeNote && activeNote._id === id) {
        setActiveNote(updatedNote);
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note.");
      throw err;
    }
  };

  const deleteNote = async (id) => {
    setError(null);
    try {
      await apiDeleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (activeNote && activeNote._id === id) {
        setActiveNote(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note.");
      throw err;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        error,
        activeNote,
        setActiveNote,
        fetchNotes,
        createNote,
        saveNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);
