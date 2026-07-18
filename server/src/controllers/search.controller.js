const Note = require("../models/note.model");
const Paper = require("../models/paper.model");

const searchWorkspace = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, data: { papers: [], notes: [] } });
    }

    const regex = new RegExp(q, "i");

    // Search notes
    const notes = await Note.find({
      project: projectId,
      owner: req.user.id,
      $or: [{ title: regex }, { content: regex }],
    }).limit(15);

    // Search papers
    const papers = await Paper.find({
      project: projectId,
      owner: req.user.id,
      $or: [
        { title: regex },
        { summary: regex },
        { concepts: { $in: [regex] } },
      ],
    }).limit(15);

    res.status(200).json({
      success: true,
      data: { papers, notes },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchWorkspace,
};
