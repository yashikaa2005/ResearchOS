const Project = require("../models/project.model");
const activityService = require("./activity.service");

const createProject = async (userId, projectData) => {
    const project = await Project.create({
        ...projectData,
        owner: userId,
    });
    
    // Log timeline activity
    await activityService.logActivity(
        userId,
        project._id,
        "PROJECT_CREATED",
        `Project "${project.title}" was created.`
    );

    return project;
};

const getProjects = async (userId) => {
    const projects = await Project.find({ owner: userId }).sort({ //newest project first
        createdAt: -1,
    });
    return projects;
};

const getProjectById = async (userId, projectId) => {
    const project = await Project.findOne({ _id: projectId, owner: userId });

    if (!project) {
        throw new Error("Project not found");
    }

    project.lastOpenedAt = new Date();
    await project.save();
    return project;
};

const updateProject = async (userId, projectId, updateData) => {
    const allowedUpdates = {
        title: updateData.title,
        description: updateData.description,
        color: updateData.color,
        icon: updateData.icon,
    };
    const project = await Project.findOneAndUpdate(
        { _id: projectId, owner: userId },
        allowedUpdates,
        { new: true, runValidators: true }
    );

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

const deleteProject = async (userId, projectId) => {
    const project = await Project.findOneAndDelete({
        _id: projectId,
        owner: userId,
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};