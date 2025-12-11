const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth.routes');
const AppError = require('../src/utils/errors');

// Mock Prisma and bcrypt
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('../src/utils/jwt', () => ({
    sign: jest.fn(() => 'mock_token'),
    verify: jest.fn(() => ({ id: 'user_id', email: 'test@example.com' })),
}));

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ status: 'error', message: err.message });
});

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            prisma.user.create.mockResolvedValue({
                id: 'user_id',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password',
            });

            const res = await request(app)
                .post('/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(201);
            expect(res.body.token).toEqual('mock_token');
        });

        it('should fail if email already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'existing_id' });

            const res = await request(app)
                .post('/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Email already in use');
        });
    });

    describe('POST /auth/login', () => {
        it('should login with correct credentials', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user_id',
                email: 'test@example.com',
                password: 'hashed_password',
            });
            bcrypt.compare.mockResolvedValue(true);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toEqual('mock_token');
        });

        it('should fail with incorrect credentials', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user_id',
                email: 'test@example.com',
                password: 'hashed_password',
            });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrong_password' });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /auth/me', () => {
        it('should return user profile', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'user_id',
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            });

            const res = await request(app)
                .get('/auth/me')
                .set('Authorization', 'Bearer valid_token');

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.user.email).toEqual('test@example.com');
        });

        it('should fail without token', async () => {
            const res = await request(app).get('/auth/me');
            expect(res.statusCode).toEqual(401);
        });
    });
});
