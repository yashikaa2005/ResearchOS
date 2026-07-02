const express = require("express");
const cors = require("cors");

const app = express(); //creates express application

// Middleware
app.use(cors()); //frontend communicates with express 
app.use(express.json()); //Allows Express to understand JSON sent from React.

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ResearchOS API is running..."
    });
}); //when localhost opened, this runs

module.exports = app;