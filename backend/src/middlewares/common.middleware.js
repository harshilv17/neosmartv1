const cors = require('cors');
const express = require('express');

// Allowed origins (add more as needed)
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// CORS configuration
const corsMiddleware = cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('🚫 CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
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
