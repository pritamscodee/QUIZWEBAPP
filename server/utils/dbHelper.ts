import mongoose from 'mongoose';

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getConnectionStatus = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export const buildPagination = (page: number = 1, limit: number = 10) => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit));
  const skip = (validPage - 1) * validLimit;
  return { skip, limit: validLimit, page: validPage };
};
