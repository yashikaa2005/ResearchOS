// models/project.model.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            default: "",
            maxlength: 500,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        color: {
            type: String,
            default: "#2563eb",
            enum: [
                "#2563eb",
                "#9333ea",
                "#16a34a",
                "#dc2626",
                "#ea580c"
            ]
        },
        icon: {
            type: String,
            default: "📚",
        },
        lastOpenedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);