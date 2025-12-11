const nodemailer = require('nodemailer');
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
    }
});

const sendEmail = async (to, subject, message) => {
    try {
        const info = await transporter.sendMail({
            from: '"MicroStack" <no-reply@microstack.com>',
            to,
            subject,
            text: message,
        });
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const subscribeToNotifications = async () => {
    const subscriber = redis.createClient({ url: REDIS_URL });
    await subscriber.connect();

    await subscriber.subscribe('notifications:email', async (message) => {
        try {
            const { to, subject, message: msg } = JSON.parse(message);
            await sendEmail(to, subject, msg);
        } catch (error) {
            console.error('Error processing notification:', error);
        }
    });

    console.log('Subscribed to notifications:email');
};

module.exports = { sendEmail, subscribeToNotifications };
