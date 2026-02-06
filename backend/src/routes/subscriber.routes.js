const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscriber.controller');
const { validateApiKey, validateOrigin, rateLimit } = require('../middlewares');

// POST /api/subscribers - Subscribe to launch notifications
// Protected by origin validation and rate limiting (public endpoint)
router.post('/', validateOrigin, rateLimit, subscribe);

// GET /api/subscribers - List all subscribers (admin only)
// Protected by API key (private endpoint)
router.get('/', validateApiKey, getSubscribers);

module.exports = router;
