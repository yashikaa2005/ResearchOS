const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Require auth for all note endpoints
router.use(authMiddleware);

// Project-specific routes
router.get("/projects/:projectId/notes", noteController.getNotes);
router.post("/projects/:projectId/notes", noteController.createNote);

// Note-specific routes
router.get("/notes/:id", noteController.getNoteById);
router.put("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);

module.exports = router;
