import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number = 200, message: string = 'Success', data: any = null, meta?: any) => {
  const response: any = { success: true, message, timestamp: new Date().toISOString() };
  if (data) response.data = data;
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number = 500, message: string = 'Internal Server Error', errors: any = null) => {
  const response: any = { success: false, message, timestamp: new Date().toISOString() };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};
