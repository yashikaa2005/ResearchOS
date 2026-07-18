const express = require("express");
const cors = require("cors");
const path = require("path");

const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const paperRoutes = require("./routes/paper.routes");
const insightRoutes = require("./routes/insight.routes");

const app = express(); //creates express application

// Middleware
app.use(cors()); //frontend communicates with express 
app.use(express.json()); //Allows Express to understand JSON sent from React.

// Serve uploaded papers statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", noteRoutes);
app.use("/api", paperRoutes);
app.use("/api", insightRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ResearchOS API is running..."
    });
}); //when localhost opened, this runs

module.exports = app;