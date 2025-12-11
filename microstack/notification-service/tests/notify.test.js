const request = require('supertest');
const express = require('express');
const notifyController = require('../src/controllers/notify.controller');

// Mock Redis
jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        connect: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn(),
    })),
}));

const app = express();
app.use(express.json());
app.post('/notify/email', notifyController.sendEmailNotification);

describe('Notification Service', () => {
    it('should queue an email notification', async () => {
        const res = await request(app)
            .post('/notify/email')
            .send({ to: 'test@example.com', subject: 'Test', message: 'Hello' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('queued');
    });

    it('should fail if fields are missing', async () => {
        const res = await request(app)
            .post('/notify/email')
            .send({ to: 'test@example.com' });

        expect(res.statusCode).toEqual(400);
    });
});
