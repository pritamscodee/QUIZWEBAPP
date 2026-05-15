import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '7d';

if (!JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET environment variable is not set. Exiting.');
  process.exit(1);
}

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string): { userId: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return token && token.length > 0 ? token : null;
};
