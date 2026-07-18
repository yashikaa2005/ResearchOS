const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const paperController = require("../controllers/paper.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Require auth for all paper endpoints
router.use(authMiddleware);

// Project-specific routes
router.get("/projects/:projectId/papers", paperController.getPapers);
router.post(
  "/projects/:projectId/papers",
  upload.single("pdf"),
  paperController.uploadPaper
);

// Paper-specific routes
router.get("/papers/:id", paperController.getPaperById);
router.delete("/papers/:id", paperController.deletePaper);

module.exports = router;
