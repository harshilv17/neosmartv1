const { corsMiddleware, jsonParser, urlEncodedParser, requestLogger } = require('./common.middleware');
const { notFoundHandler, errorHandler } = require('./error.middleware');
const { validateApiKey, validateOrigin, rateLimit } = require('./security.middleware');

module.exports = {
    corsMiddleware,
    jsonParser,
    urlEncodedParser,
    requestLogger,
    notFoundHandler,
    errorHandler,
    validateApiKey,
    validateOrigin,
    rateLimit
};
