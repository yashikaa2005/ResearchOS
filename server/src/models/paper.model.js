const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "failed"],
      default: "processing",
    },
    parsedText: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    concepts: {
      type: [String],
      default: [],
    },
    keyFindings: {
      type: [String],
      default: [],
    },
    paperType: {
      type: String,
      default: "Research Paper",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);
