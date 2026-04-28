import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  if (err instanceof ZodError) {
    message = err.errors.map(e => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  console.error(`[ERROR] ${err.stack}`);
  res.status(statusCode).json({ success: false, message, timestamp: new Date().toISOString() });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};