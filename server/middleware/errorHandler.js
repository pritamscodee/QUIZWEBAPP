/**
 * ERROR HANDLER - Global error handling middleware
 */

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    console.error(`[ERROR] ${err.stack}`);
    
    res.status(statusCode).json({
        success: false,
        message: message,
        timestamp: new Date().toISOString()
    });
};

export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};