const noteService = require("../services/note.service");

const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(
      req.user.id,
      req.params.projectId,
      req.body
    );
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteService.getNotes(req.user.id, req.params.projectId);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
