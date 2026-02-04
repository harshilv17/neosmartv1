const Subscriber = require('../models/subscriber.model');

// POST /api/subscribers - Subscribe to notifications
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.status(409).json({ 
                error: 'This email is already subscribed',
                alreadySubscribed: true 
            });
        }

        // Create new subscriber
        const subscriber = await Subscriber.create({ email });

        res.status(201).json({ 
            message: 'Successfully subscribed! We\'ll notify you when we launch.',
            subscriber: { email: subscriber.email }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
    }
};

// GET /api/subscribers - Get all subscribers (admin use)
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true })
            .select('email subscribedAt')
            .sort({ subscribedAt: -1 });

        res.json({ 
            count: subscribers.length,
            subscribers 
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
};

module.exports = {
    subscribe,
    getSubscribers
};
