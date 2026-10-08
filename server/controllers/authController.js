const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET environment variable is not defined.');
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ id }, secret, { expiresIn });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('sp_token', token, cookieOptions);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            rollNo: user.rollNo,
            branch: user.branch,
            semester: user.semester,
            studyGoal: user.studyGoal,
            notes: user.notes,
            createdAt: user.createdAt
        }
    });
};

// @route POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, rollNo, branch, semester, studyGoal, notes } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match.'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email address already exists.'
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: password,
            rollNo: rollNo ? rollNo.trim() : '',
            branch: branch ? branch.trim() : '',
            semester: semester ? semester.trim() : '',
            studyGoal: studyGoal ? studyGoal.trim() : '20',
            notes: notes ? notes.trim() : ''
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @route POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @route POST /api/auth/logout
exports.logout = (req, res) => {
    res.clearCookie('sp_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    });
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

// @route PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, rollNo, branch, semester, studyGoal, notes } = req.body;

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name.trim();
        if (rollNo !== undefined) fieldsToUpdate.rollNo = rollNo.trim();
        if (branch !== undefined) fieldsToUpdate.branch = branch.trim();
        if (semester !== undefined) fieldsToUpdate.semester = semester.trim();
        if (studyGoal !== undefined) fieldsToUpdate.studyGoal = studyGoal.trim();
        if (notes !== undefined) fieldsToUpdate.notes = notes.trim();

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/auth/password
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long.'
            });
        }

        const user = await User.findById(req.userId);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect.'
            });
        }

        user.passwordHash = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully.'
        });
    } catch (err) {
        next(err);
    }
};
