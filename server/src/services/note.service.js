const Note = require("../models/note.model");
const activityService = require("./activity.service");

const createNote = async (userId, projectId, noteData) => {
  const note = await Note.create({
    ...noteData,
    project: projectId,
    owner: userId,
  });

  // Log activity
  await activityService.logActivity(
    userId,
    projectId,
    "NOTE_CREATED",
    `Created note "${note.title}".`
  );

  return note;
};

const getNotes = async (userId, projectId) => {
  return await Note.find({ owner: userId, project: projectId })
    .populate("paper", "title")
    .sort({
      updatedAt: -1,
    });
};

const getNoteById = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, owner: userId }).populate("paper", "title");
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
};

const updateNote = async (userId, noteId, updateData) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, owner: userId },
    {
      title: updateData.title,
      content: updateData.content,
      paper: updateData.paper === "" || updateData.paper === null ? null : updateData.paper,
    },
    { new: true, runValidators: true }
  ).populate("paper", "title");

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

const deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, owner: userId });
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
