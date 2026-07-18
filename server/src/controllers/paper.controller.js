const paperService = require("../services/paper.service");

const uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded" });
    }

    const paper = await paperService.createPaper(
      req.user.id,
      req.params.projectId,
      req.file,
      req.body.title
    );

    res.status(201).json({ success: true, data: paper });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPapers = async (req, res) => {
  try {
    const papers = await paperService.getPapers(req.user.id, req.params.projectId);
    res.status(200).json({ success: true, data: papers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaperById = async (req, res) => {
  try {
    const paper = await paperService.getPaperById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: paper });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deletePaper = async (req, res) => {
  try {
    await paperService.deletePaper(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Paper deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadPaper,
  getPapers,
  getPaperById,
  deletePaper,
};
