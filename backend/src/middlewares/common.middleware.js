const cors = require('cors');
const express = require('express');

// CORS configuration
const corsMiddleware = cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

// Body parsing middleware
const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: true });

// Request logger middleware
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

module.exports = {
    corsMiddleware,
    jsonParser,
    urlEncodedParser,
    requestLogger
};
