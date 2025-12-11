const request = require('supertest');
const express = require('express');
const fileRoutes = require('../src/routes/file.routes');
const path = require('path');
const fs = require('fs');

// Mock Middleware and Storage
jest.mock('../src/middlewares/auth.middleware', () => (req, res, next) => {
    req.user = { id: 'test_user' };
    next();
});

jest.mock('../src/services/storage.service', () => {
    const multer = require('multer');
    const storage = multer.memoryStorage();
    return multer({ storage });
});

const app = express();
app.use(express.json());
app.use('/file', fileRoutes);

describe('File Service', () => {
    it('should upload a file', async () => {
        const res = await request(app)
            .post('/file/upload')
            .attach('file', Buffer.from('test content'), 'test.txt');

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('success');
        expect(res.body.data).toHaveProperty('fileId');
        expect(res.body.data).toHaveProperty('url');
    });

    it('should fail if no file uploaded', async () => {
        const res = await request(app)
            .post('/file/upload');

        expect(res.statusCode).toEqual(400);
    });
});
