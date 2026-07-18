const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Activity = require("./src/models/activity.model");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");
  const activities = await Activity.find({});
  console.log(`Total activities in DB: ${activities.length}`);
  if (activities.length > 0) {
    console.log("First activity:", activities[0]);
  }
  await mongoose.disconnect();
};

run();
