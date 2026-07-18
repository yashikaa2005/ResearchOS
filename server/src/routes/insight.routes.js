const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insights.controller");
const searchController = require("../controllers/search.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Require auth for all insights/search endpoints
router.use(authMiddleware);

router.get("/activities", insightsController.getGlobalActivities);
router.get("/projects/:projectId/insights", insightsController.getProjectInsights);
router.get("/projects/:projectId/graph", insightsController.getKnowledgeGraph);
router.get("/projects/:projectId/activities", insightsController.getProjectActivities);
router.get("/projects/:projectId/search", searchController.searchWorkspace);

module.exports = router;
