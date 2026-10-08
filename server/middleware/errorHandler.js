const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(err.errors).map(val => val.message);
        message = messages.join('. ');
    }

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }

    // Mongoose duplicate key error (11000)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `Duplicate value entered for ${field}. Please use another value.`;
    }

    // Log internally in development, never leak stack trace to user
    if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
        console.error('[Server Error Detail]:', err);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
