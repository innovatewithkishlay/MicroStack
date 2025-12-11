require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notifyController = require('./controllers/notify.controller');
const { subscribeToNotifications } = require('./services/email.service');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/notify/email', notifyController.sendEmailNotification);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 4003;

app.listen(PORT, async () => {
    console.log(`Notification Service running on port ${PORT}`);
    await subscribeToNotifications();
});
