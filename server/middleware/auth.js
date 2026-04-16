import { verifyToken, extractTokenFromHeader } from '../utils/jwtHelper.js';
import { sendError } from '../utils/responseHelper.js';
import { logError, logInfo } from '../utils/logger.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/constants.js';

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if (!token) {
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
        }
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        logInfo(`User authenticated: ${decoded.userId}`);
        next();
        
    } catch (error) {
        logError('Authentication error', error);
        
        if (error.message === 'Invalid or expired token') {
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
        }
        next(error);
    }
};

export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return sendError(res, HTTP_STATUS.FORBIDDEN, RESPONSE_MESSAGES.FORBIDDEN);
    }
    next();
};