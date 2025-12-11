const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'default_secret_do_not_use_in_production';

const verify = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
    }

    try {
        const decoded = verify(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
};

module.exports = protect;
