const formatLog = (level: string, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  if (data) log += `\nData: ${JSON.stringify(data, null, 2)}`;
  return log;
};

export const logInfo = (message: string, data?: any): void => {
  console.log(formatLog('INFO', message, data));
};

export const logError = (message: string, data?: any): void => {
  console.error(formatLog('ERROR', message, data));
};

export const logWarn = (message: string, data?: any): void => {
  console.warn(formatLog('WARN', message, data));
};

export const logDebug = (message: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatLog('DEBUG', message, data));
  }
};
