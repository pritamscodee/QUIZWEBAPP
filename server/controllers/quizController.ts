import { RequestHandler } from 'express';
import Quiz from '../models/Quiz';
import { quizSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { logInfo, logError } from '../utils/logger';

export const getAllQuizzes: RequestHandler = async (req, res, next) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const filter: any = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    const skip = (Number(page) - 1) * Number(limit);
    const quizzes = await Quiz.find(filter).select('-questions.correctAnswer').skip(skip).limit(Number(limit));
    const total = await Quiz.countDocuments(filter);
    return sendSuccess(res, 200, 'Quizzes fetched', quizzes, { page, limit, total, totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) { next(error); }
};

export const getQuizById: RequestHandler = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');
    if (!quiz) return sendError(res, 404, 'Quiz not found');
    return sendSuccess(res, 200, 'Quiz fetched', quiz);
  } catch (error) { next(error); }
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
    logInfo(`New quiz created: ${quiz.title} by user ${req.userId}`);
    return sendSuccess(res, 201, 'Quiz created', quiz);
  } catch (error) { next(error); }
};