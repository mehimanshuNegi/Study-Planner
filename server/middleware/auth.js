const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        let token = null;

        // 1. Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // 2. Check cookies if cookie-parser is used
        if (!token && req.cookies && req.cookies.sp_token) {
            token = req.cookies.sp_token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. No authorization token provided.'
            });
        }

        // 3. Verify token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: JWT_SECRET environment variable is not defined.'
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (jwtErr) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired authentication token.'
            });
        }

        // 4. Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.'
            });
        }

        // Attach user info to request
        req.userId = user._id;
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Authentication verification error.'
        });
    }
};

module.exports = auth;
