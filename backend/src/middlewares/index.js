const { corsMiddleware, jsonParser, urlEncodedParser, requestLogger } = require('./common.middleware');
const { notFoundHandler, errorHandler } = require('./error.middleware');

module.exports = {
    corsMiddleware,
    jsonParser,
    urlEncodedParser,
    requestLogger,
    notFoundHandler,
    errorHandler
};
