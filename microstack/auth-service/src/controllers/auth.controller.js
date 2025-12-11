const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, token } = await authService.register(name, email, password);
        res.status(201).json({ status: 'success', token, data: { user } });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.status(200).json({ status: 'success', token, data: { user } });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await authService.getUser(req.user.id);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, me };
