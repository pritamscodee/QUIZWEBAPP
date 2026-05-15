import { RequestHandler } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwtHelper';
import { userSchema, loginSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { logInfo, logError } from '../utils/logger';
import { RESPONSE_MESSAGES } from '../utils/constants';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 400, result.error.errors.map(e => e.message).join(', '));
    }

    const { username, email, password } = result.data;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return sendError(res, 400, RESPONSE_MESSAGES.USER_EXISTS);

    const user = new User({ username, email, password, role: 'user' });
    await user.save();

    const token = generateToken(user._id.toString(), user.role);
    logInfo(`New user registered: ${email}`);
    return sendSuccess(res, 201, RESPONSE_MESSAGES.REGISTER_SUCCESS, {
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    logError('Registration error', error);
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 400, result.error.errors.map(e => e.message).join(', '));
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = generateToken(user._id.toString(), user.role);
    logInfo(`User logged in: ${email}`);
    return sendSuccess(res, 200, RESPONSE_MESSAGES.LOGIN_SUCCESS, {
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    logError('Login error', error);
    next(error);
  }
};

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'Profile fetched', user.getPublicProfile());
  } catch (error) {
    next(error);
  }
};
