const paperService = require("../services/paper.service");
const geminiService = require("../services/gemini.service");
const activityService = require("../services/activity.service");

const getProjectInsights = async (req, res) => {
  console.log(`[InsightsController] getProjectInsights called for project: ${req.params.projectId}`);
  try {
    const papers = await paperService.getPapers(req.user.id, req.params.projectId);
    console.log(`[InsightsController] Found ${papers.length} papers for project.`);
    const insights = await geminiService.analyzeProjectInsights(papers);
    console.log(`[InsightsController] Analysis complete. Returning insights.`);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    console.error("[InsightsController] getProjectInsights error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getKnowledgeGraph = async (req, res) => {
  console.log(`[InsightsController] getKnowledgeGraph called for project: ${req.params.projectId}`);
  try {
    const papers = await paperService.getPapers(req.user.id, req.params.projectId);
    const readyPapers = papers.filter((p) => p.status === "ready");
    console.log(`[InsightsController] Found ${readyPapers.length} ready papers for graph.`);

    const nodes = [];
    const links = [];
    const addedConcepts = new Set();

    readyPapers.forEach((paper) => {
      // Add paper node
      nodes.push({
        id: paper._id.toString(),
        label: paper.title,
        type: "paper",
      });

      // Filter out generic headings
      const genericExclusions = ["methodology", "literature review", "research methodology", "empirical validation", "data analysis", "review", "methods"];
      let concepts = (paper.concepts || []).filter(
        (c) => !genericExclusions.includes(c.toLowerCase().trim())
      );

      // If no specific technical concepts exist, extract them on the fly from text/title
      if (concepts.length === 0 && paper.parsedText) {
        const textToScan = (paper.title + " " + paper.parsedText.slice(0, 15000)).toLowerCase();
        const methodMap = [
          { term: "BERT Model", pattern: /\bbert\b/ },
          { term: "RoBERTa Classifier", pattern: /\broberta\b/ },
          { term: "DeBERTa Model", pattern: /\bdeberta\b/ },
          { term: "LSTM Network", pattern: /\blstm|bilstm\b/ },
          { term: "Support Vector Machine (SVM)", pattern: /\bsvm|support vector machine\b/ },
          { term: "Random Forest", pattern: /\brandom forest\b/ },
          { term: "Logistic Regression", pattern: /\blogistic regression\b/ },
          { term: "Naive Bayes", pattern: /\bnaive bayes\b/ },
          { term: "Convolutional Neural Network (CNN)", pattern: /\bcnn|convolutional neural\b/ },
          { term: "XGBoost Classifier", pattern: /\bxgboost\b/ },
          { term: "Transformers", pattern: /\btransformers|attention\b/ },
          { term: "LIAR Dataset", pattern: /\bliar dataset|liar benchmark\b/ }
        ];
        methodMap.forEach(m => {
          if (m.pattern.test(textToScan)) {
            concepts.push(m.term);
          }
        });
      }

      if (concepts.length === 0) {
        concepts.push("Supervised Classifier");
        concepts.push("Feature Engineering");
      }

      // Add concept nodes and links
      concepts.forEach((concept) => {
        const conceptId = `c_${concept.toLowerCase().trim()}`;
        if (!addedConcepts.has(conceptId)) {
          nodes.push({
            id: conceptId,
            label: concept,
            type: "concept",
          });
          addedConcepts.add(conceptId);
        }

        links.push({
          source: paper._id.toString(),
          target: conceptId,
        });
      });
    });

    console.log(`[InsightsController] Graph compiled: ${nodes.length} nodes, ${links.length} links.`);
    res.status(200).json({ success: true, data: { nodes, links } });
  } catch (error) {
    console.error("[InsightsController] getKnowledgeGraph error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProjectActivities = async (req, res) => {
  console.log(`[InsightsController] getProjectActivities called for project: ${req.params.projectId}`);
  try {
    const activities = await activityService.getActivities(
      req.user.id,
      req.params.projectId
    );
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("[InsightsController] getProjectActivities error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getGlobalActivities = async (req, res) => {
  console.log(`[InsightsController] getGlobalActivities called for user: ${req.user.id}`);
  try {
    const activities = await activityService.getGlobalActivities(req.user.id);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("[InsightsController] getGlobalActivities error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjectInsights,
  getKnowledgeGraph,
  getProjectActivities,
  getGlobalActivities,
};
