const { verify } = require('../utils/jwt');
const AppError = require('../utils/errors');

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = verify(token);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};

module.exports = protect;
