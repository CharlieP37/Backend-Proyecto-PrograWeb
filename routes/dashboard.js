const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/authenticateToken.js'); 

router.get('/weekly-summary', authenticateToken, controller.getWeeklySummary);

module.exports = router;
