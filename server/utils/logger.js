const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

const formatLog = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
        logMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
    }
    return logMessage;
};

export const logError = (message, data = null) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, data));
};
export const logWarn = (message, data = null) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
};
export const logInfo = (message, data = null) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, data));
};
export const logDebug = (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
        console.debug(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
};