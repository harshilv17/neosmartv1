const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscriber.controller');

// POST /api/subscribers - Subscribe to launch notifications
router.post('/', subscribe);

// GET /api/subscribers - List all subscribers (admin)
router.get('/', getSubscribers);

module.exports = router;
