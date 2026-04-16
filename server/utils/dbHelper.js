import mongoose from 'mongoose';

export const isDatabaseConnected = () => {
    return mongoose.connection.readyState === 1;
};

export const getConnectionStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    return states[mongoose.connection.readyState] || 'unknown';
};

export const sanitizeQueryParams = (query) => {
    const sanitized = {};
    const allowedOperators = ['$eq', '$gt', '$gte', '$lt', '$lte', '$in'];
    
    for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'object' && value !== null) {
            const operator = Object.keys(value)[0];
            if (allowedOperators.includes(operator)) {
                sanitized[key] = value;
            }
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

export const buildPagination = (page = 1, limit = 10) => {
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (validPage - 1) * validLimit;
    
    return {
        skip: skip,
        limit: validLimit,
        page: validPage
    };
};