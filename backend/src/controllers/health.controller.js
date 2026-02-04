// Health check controller

const getHealth = (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};

const getApiInfo = (req, res) => {
    res.json({ 
        message: 'Welcome to NeoSmart Labs API',
        version: '1.0.0'
    });
};

module.exports = {
    getHealth,
    getApiInfo
};
