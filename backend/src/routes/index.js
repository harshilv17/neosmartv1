const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health.routes');
const subscriberRoutes = require('./subscriber.routes');

// Mount routes
router.use('/', healthRoutes);
router.use('/subscribers', subscriberRoutes);

module.exports = router;
