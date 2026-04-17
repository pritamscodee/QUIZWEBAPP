import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '7d';
if (!JWT_SECRET) {
  console.error(' JWT_SECRET is not defined in .env file!');
} else {
  console.log(' JWT Helper initialized with secret from .env');
}
export const generateToken = (userId, role) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Please set it in .env');
  }
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
