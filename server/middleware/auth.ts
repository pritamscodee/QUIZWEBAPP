import { RequestHandler } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtHelper';
import { sendError } from '../utils/responseHelper';

export const authenticateUser: RequestHandler = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) return sendError(res, 401, 'No token provided');
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.userRole !== 'admin') return sendError(res, 403, 'Admin access required');
  next();
};