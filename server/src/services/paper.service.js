const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Paper = require("../models/paper.model");
const geminiService = require("./gemini.service");
const activityService = require("./activity.service");

const createPaper = async (userId, projectId, fileData, customTitle) => {
  // 1. Save metadata into MongoDB (status is 'processing' initially)
  const paper = await Paper.create({
    title: customTitle || fileData.originalname.replace(".pdf", ""),
    originalName: fileData.originalname,
    filename: fileData.filename,
    filepath: fileData.path,
    fileSize: fileData.size,
    status: "processing",
    project: projectId,
    owner: userId,
  });

  // Log timeline activity immediately
  await activityService.logActivity(
    userId,
    projectId,
    "PAPER_UPLOADED",
    `Uploaded paper "${paper.title}".`
  );

  // 2. Trigger asynchronous background processing (not blocking the HTTP response)
  processPaperInBackground(paper._id, fileData.path, userId, projectId);

  return paper;
};

// Asynchronous background task
const processPaperInBackground = async (paperId, filePath, userId, projectId) => {
  console.log(`[Background Task] Starting parsing for paper: ${paperId}`);
  try {
    // A. Read the PDF file from disk
    const dataBuffer = fs.readFileSync(filePath);
    
    // B. Parse PDF text using pdf-parse
    const parsedData = await pdfParse(dataBuffer);
    const textContent = parsedData.text || "";

    // C. Call Gemini to synthesize summary, concepts, and key findings
    const analysis = await geminiService.analyzePaper(
      // Fetch paper again in case it got renamed during processing
      (await Paper.findById(paperId))?.title || "Research Paper",
      textContent
    );

    // D. Update database record with extracted details
    const paper = await Paper.findByIdAndUpdate(
      paperId,
      {
        parsedText: textContent,
        summary: analysis.summary,
        concepts: analysis.concepts,
        keyFindings: analysis.keyFindings,
        paperType: analysis.paperType || "Research Paper",
        status: "ready",
      },
      { new: true }
    );

    // Log AI summary generated activity
    await activityService.logActivity(
      userId,
      projectId,
      "AI_SUMMARY_GENERATED",
      `AI generated research summary and extracted concepts for "${paper.title}".`
    );

    console.log(`[Background Task] Successfully processed paper: ${paperId}`);
  } catch (error) {
    console.error(`[Background Task] Error processing paper ${paperId}:`, error);
    await Paper.findByIdAndUpdate(paperId, { status: "failed" });
  }
};

const getPapers = async (userId, projectId) => {
  return await Paper.find({ owner: userId, project: projectId }).sort({
    createdAt: -1,
  });
};

const getPaperById = async (userId, paperId) => {
  const paper = await Paper.findOne({ _id: paperId, owner: userId });
  if (!paper) {
    throw new Error("Paper not found");
  }
  return paper;
};

const deletePaper = async (userId, paperId) => {
  const paper = await Paper.findOne({ _id: paperId, owner: userId });
  if (!paper) {
    throw new Error("Paper not found");
  }

  // Delete physical file from disk
  const absolutePath = path.resolve(paper.filepath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await Paper.findByIdAndDelete(paperId);
  return paper;
};

module.exports = {
  createPaper,
  getPapers,
  getPaperById,
  deletePaper,
};
