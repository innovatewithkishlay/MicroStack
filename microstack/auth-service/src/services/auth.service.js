const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { sign } = require('../utils/jwt');
const AppError = require('../utils/errors');

const prisma = new PrismaClient();

const register = async (name, email, password) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const token = sign({ id: user.id, email: user.email });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};

const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    const token = sign({ id: user.id, email: user.email });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};

const getUser = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
};

module.exports = { register, login, getUser };
