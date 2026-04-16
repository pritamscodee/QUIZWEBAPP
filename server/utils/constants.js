export const QUIZ_CATEGORIES = {
    PROGRAMMING: 'Programming',
    SCIENCE: 'Science',
    HISTORY: 'History',
    MATHEMATICS: 'Mathematics',
    GENERAL: 'General'
};

export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
};

export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const RESPONSE_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    QUIZ_CREATED: 'Quiz created successfully',
    QUIZ_UPDATED: 'Quiz updated successfully',
    QUIZ_DELETED: 'Quiz deleted successfully',
    RESULT_SAVED: 'Quiz result saved successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    USERNAME_TOO_SHORT: 'Username must be at least 3 characters'
};