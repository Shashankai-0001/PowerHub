// API Routes for User Authentication
// Routes mapping for /api/v1/auth endpoints
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
