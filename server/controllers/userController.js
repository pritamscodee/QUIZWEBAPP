import User from '../models/User.js';
import { generateToken } from '../utils/jwtHelper.js';
import { isValidEmail, validatePassword, validateUsername } from '../utils/validationHelper.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logInfo, logError } from '../utils/logger.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/constants.js';

export const register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!isValidEmail(email)) {
            return sendError(res, HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.INVALID_EMAIL);
        }
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return sendError(res, HTTP_STATUS.BAD_REQUEST, usernameValidation.message);
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return sendError(res, HTTP_STATUS.BAD_REQUEST, passwordValidation.message);
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return sendError(res, HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.USER_EXISTS);
        }
        const allowedRoles = ['user', 'admin'];
        const userRole = (role && allowedRoles.includes(role)) ? role : 'user';

        const user = new User({ username, email, password, role: userRole });
        await user.save();

        const token = generateToken(user._id, user.role);
        logInfo(`New user registered: ${email} with role ${user.role}`);

        return sendSuccess(res, HTTP_STATUS.CREATED, RESPONSE_MESSAGES.REGISTER_SUCCESS, {
            token,
            user: user.getPublicProfile()
        });
    } catch (error) {
        logError('Registration error', error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, RESPONSE_MESSAGES.INVALID_CREDENTIALS);
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, RESPONSE_MESSAGES.INVALID_CREDENTIALS);
        }
        const token = generateToken(user._id, user.role);
        logInfo(`User logged in: ${email}`);
        return sendSuccess(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.LOGIN_SUCCESS, {
            token,
            user: user.getPublicProfile()
        });
    } catch (error) {
        logError('Login error', error);
        next(error);
    }
};
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return sendError(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.NOT_FOUND);
        }
        return sendSuccess(res, HTTP_STATUS.OK, 'Profile fetched', user.getPublicProfile());
    } catch (error) {
        next(error);
    }
};
