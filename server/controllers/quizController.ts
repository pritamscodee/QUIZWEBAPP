import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz';
import { quizSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { buildPagination } from '../utils/dbHelper';
import { logInfo, logError } from '../utils/logger';
import { RESPONSE_MESSAGES } from '../utils/constants';

export const getAllQuizzes: RequestHandler = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const rawPage = parseInt(req.query.page as string, 10);
    const rawLimit = parseInt(req.query.limit as string, 10);

    const { skip, limit, page } = buildPagination(
      isNaN(rawPage) ? 1 : rawPage,
      isNaN(rawLimit) ? 10 : rawLimit
    );

    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter)
        .select('-questions.correctAnswer')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Quiz.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Quizzes fetched', quizzes, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid quiz ID format');
    }

    const quiz = await Quiz.findById(id)
      .select('-questions.correctAnswer')
      .populate('createdBy', 'username');

    if (!quiz) return sendError(res, 404, 'Quiz not found');
    return sendSuccess(res, 200, 'Quiz fetched', quiz);
  } catch (error) {
    next(error);
  }
};

export const createQuiz: RequestHandler = async (req, res, next) => {
  try {
    const result = quizSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map(e => e.message).join(', ');
      return sendError(res, 400, messages);
    }

    const quizData = { ...result.data, createdBy: req.userId };
    const quiz = new Quiz(quizData);
    await quiz.save();

    logInfo(`New quiz created: "${quiz.title}" by user ${req.userId}`);
    return sendSuccess(res, 201, RESPONSE_MESSAGES.QUIZ_CREATED, quiz);
  } catch (error) {
    logError('Create quiz error', error);
    next(error);
  }
};
