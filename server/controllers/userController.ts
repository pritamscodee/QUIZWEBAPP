import { RequestHandler } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwtHelper';
import { userSchema, loginSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { logInfo, logError } from '../utils/logger';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 400, result.error.errors.map(e => e.message).join(', '));
    }
    const { username, email, password, role } = result.data;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return sendError(res, 400, 'User already exists');
    const user = new User({ username, email, password, role: role || 'user' });
    await user.save();
    const token = generateToken(user._id.toString(), user.role);
    logInfo(`New user registered: ${email} with role ${user.role}`);
    return sendSuccess(res, 201, 'Registration successful', { token, user: user.getPublicProfile() });
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
      return sendError(res, 401, 'Invalid credentials');
    }
    const token = generateToken(user._id.toString(), user.role);
    logInfo(`User logged in: ${email}`);
    return sendSuccess(res, 200, 'Login successful', { token, user: user.getPublicProfile() });
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