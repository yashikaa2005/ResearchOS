const Activity = require("../models/activity.model");

const logActivity = async (userId, projectId, type, message) => {
  try {
    const activity = await Activity.create({
      owner: userId,
      project: projectId,
      type,
      message,
    });
    return activity;
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

const getActivities = async (userId, projectId) => {
  let activities = await Activity.find({ owner: userId, project: projectId })
    .sort({ createdAt: -1 })
    .limit(30);

  if (activities.length === 0) {
    const Paper = require("../models/paper.model");
    const Note = require("../models/note.model");

    const papers = await Paper.find({ owner: userId, project: projectId }).sort({ createdAt: 1 });
    const notes = await Note.find({ owner: userId, project: projectId }).sort({ createdAt: 1 });

    for (const paper of papers) {
      await logActivity(
        userId,
        projectId,
        "PAPER_UPLOADED",
        `Uploaded paper "${paper.title}"`
      );
      if (paper.status === "ready") {
        await logActivity(
          userId,
          projectId,
          "AI_SUMMARY_GENERATED",
          `AI successfully analyzed and generated insights for "${paper.title}"`
        );
      }
    }

    for (const note of notes) {
      await logActivity(
        userId,
        projectId,
        "NOTE_CREATED",
        `Created note "${note.title}".`
      );
    }

    activities = await Activity.find({ owner: userId, project: projectId })
      .sort({ createdAt: -1 })
      .limit(30);
  }

  return activities;
};

const getGlobalActivities = async (userId) => {
  return await Activity.find({ owner: userId })
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .limit(10);
};

module.exports = {
  logActivity,
  getActivities,
  getGlobalActivities,
};
