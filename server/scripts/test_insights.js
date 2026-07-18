const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const Paper = require("../src/models/paper.model");
const geminiService = require("../src/services/gemini.service");

const test = async () => {
  console.log("Connecting to DB:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected.");

  // Get all papers
  const papers = await Paper.find({});
  console.log(`Found ${papers.length} papers in DB.`);
  if (papers.length > 0) {
    console.log("First paper:", {
      id: papers[0]._id,
      title: papers[0].title,
      status: papers[0].status,
      concepts: papers[0].concepts,
      keyFindings: papers[0].keyFindings,
      hasText: !!papers[0].parsedText,
    });
  }

  console.log("Running analyzeProjectInsights...");
  try {
    const res = await geminiService.analyzeProjectInsights(papers);
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (error) {
    console.error("Error running analyzeProjectInsights:", error);
  }

  await mongoose.disconnect();
  console.log("Done.");
};

test();
