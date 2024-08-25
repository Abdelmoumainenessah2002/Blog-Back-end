// not-found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// Error Handler middlware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
}

module.exports = { notFound, errorHandler };