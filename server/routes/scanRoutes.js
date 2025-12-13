const express = require('express');
const router = express.Router();
const FoodScan = require('../models/FoodScan');
const { analyzeFood } = require('../services/foodService');
const { protect } = require('../middleware/authMiddleware');

// @desc    Scan and Analyze Barcode
// @route   POST /api/v1/scan
// @access  Private
const scanBarcode = async (req, res) => {
    const { barcode } = req.body;

    if (!barcode) {
        return res.status(400).json({ message: 'Barcode is required' });
    }

    try {
        // Check if already scanned by user? Optional. 
        // Requirement says "Save scan history". 
        // We will fetch fresh data every time.

        const analysis = await analyzeFood(barcode);

        // Save to DB
        const scan = await FoodScan.create({
            userId: req.user._id,
            barcode,
            ...analysis,
        });

        res.status(201).json(scan);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error.message || 'Product not found' });
    }
};

// @desc    Get Scan History
// @route   GET /api/v1/scan/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const history = await FoodScan.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

router.post('/', protect, scanBarcode);
router.get('/history', protect, getHistory);

module.exports = router;
