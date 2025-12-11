const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
let publisher;

(async () => {
    publisher = redis.createClient({ url: REDIS_URL });
    await publisher.connect();
})();

const sendEmailNotification = async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    try {
        await publisher.publish('notifications:email', JSON.stringify({ to, subject, message }));
        res.status(200).json({ status: 'success', message: 'queued' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to queue notification' });
    }
};

module.exports = { sendEmailNotification };
