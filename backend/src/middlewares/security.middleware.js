/**
 * Security Middleware
 * Protects API endpoints from unauthorized access
 */

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

/**
 * API Key validation middleware
 * Validates that requests include a valid API key
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_SECRET_KEY;

    // Skip validation if no API key is configured (development mode)
    if (!validApiKey) {
        console.warn('⚠️ API_SECRET_KEY not set - API key validation disabled');
        return next();
    }

    if (!apiKey) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'API key is required' 
        });
    }

    if (apiKey !== validApiKey) {
        return res.status(403).json({ 
            error: 'Forbidden',
            message: 'Invalid API key' 
        });
    }

    next();
};

/**
 * Origin validation middleware
 * Blocks requests from non-whitelisted origins (works for non-browser clients too)
 */
const validateOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    
    const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (server-to-server, mobile apps)
    // But require API key for those
    if (!origin && !referer) {
        // Check if API key is present for non-browser requests
        const apiKey = req.headers['x-api-key'];
        if (!apiKey && process.env.API_SECRET_KEY) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Direct API access requires API key'
            });
        }
        return next();
    }

    // Check origin or referer
    const requestOrigin = origin || new URL(referer).origin;
    const isAllowed = allowedOrigins.some(allowed => 
        requestOrigin === allowed || requestOrigin.startsWith(allowed)
    );

    if (!isAllowed) {
        console.log('🚫 Blocked request from:', requestOrigin);
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Origin not allowed'
        });
    }

    next();
};

/**
 * Rate limiting middleware
 * Limits requests per IP to prevent abuse
 */
const rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    if (rateLimitMap.has(ip)) {
        const entry = rateLimitMap.get(ip);
        if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
            rateLimitMap.set(ip, { windowStart: now, count: 1 });
        } else {
            entry.count++;
            if (entry.count > MAX_REQUESTS_PER_WINDOW) {
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded. Please try again later.'
                });
            }
        }
    } else {
        rateLimitMap.set(ip, { windowStart: now, count: 1 });
    }

    next();
};

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) {
            rateLimitMap.delete(ip);
        }
    }
}, 5 * 60 * 1000);

module.exports = {
    validateApiKey,
    validateOrigin,
    rateLimit
};
