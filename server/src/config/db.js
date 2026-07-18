const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Disable command buffering so queries fail immediately if the DB is disconnected
        mongoose.set("bufferCommands", false);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if connection cannot be established within 5 seconds
        });

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;