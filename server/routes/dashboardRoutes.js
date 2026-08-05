// API Routes for User Dashboard Data
// Routes mapping for /api/v1/dashboard endpoints
const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getDashboardData);

module.exports = router;
