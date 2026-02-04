const express = require('express');
const routes = require('./routes');
const { 
    corsMiddleware, 
    jsonParser, 
    urlEncodedParser, 
    requestLogger,
    notFoundHandler,
    errorHandler 
} = require('./middlewares');

const app = express();

// Apply middlewares
app.use(corsMiddleware);
app.use(jsonParser);
app.use(urlEncodedParser);
app.use(requestLogger);

// Mount API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
