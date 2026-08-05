// API Routes for Diet Logging and Analytics
// Routes mapping for /api/diet endpoints
const express = require("express");
const router = express.Router();
const { getDietSummary, saveDietLog, getDietHistory, getAnalytics, generateMealPlan } = require("../controllers/dietController");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, getDietSummary);
router.post("/save", protect, saveDietLog);
router.get("/history", protect, getDietHistory);
router.get("/analytics", protect, getAnalytics);
router.get("/plan/generate", protect, generateMealPlan);

module.exports = router;
