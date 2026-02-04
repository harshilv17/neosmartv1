const express = require('express');
const router = express.Router();
const { getHealth, getApiInfo } = require('../controllers/health.controller');

// GET /api/health - Health check
router.get('/health', getHealth);

// GET /api - API info
router.get('/', getApiInfo);

module.exports = router;
