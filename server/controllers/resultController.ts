import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Result from '../models/Result';
import Quiz from '../models/Quiz';
import User from '../models/User';
import { calculateQuizScore } from '../utils/quizHelper';
import { submitQuizSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { buildPagination } from '../utils/dbHelper';
import { logInfo, logError } from '../utils/logger';
import { RESPONSE_MESSAGES } from '../utils/constants';

export const submitQuiz: RequestHandler = async (req, res, next) => {
  try {
    const parsed = submitQuizSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, parsed.error.errors.map(e => e.message).join(', '));
    }

    const { quizId, answers, timeTaken } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return sendError(res, 400, 'Invalid quiz ID format');
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return sendError(res, 404, 'Quiz not found');

    if (answers.length !== quiz.questions.length) {
      return sendError(
        res,
        400,
        `Expected ${quiz.questions.length} answers, received ${answers.length}`
      );
    }

    const scoreResult = calculateQuizScore(quiz.questions as any, answers);

    const result = new Result({
      userId: req.userId,
      quizId,
      score: scoreResult.score,
      totalPossibleScore: scoreResult.totalPossible,
      percentage: scoreResult.percentage,
      answers: scoreResult.detailedAnswers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.userAnswer,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned,
      })),
      timeTaken,
    });

    await result.save();

    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        totalQuizzesTaken: 1,
        totalScore: scoreResult.score,
      },
    });

    logInfo(
      `Quiz submitted: User ${req.userId} scored ${scoreResult.score}/${scoreResult.totalPossible} (${scoreResult.percentage}%)`
    );

    return sendSuccess(res, 201, RESPONSE_MESSAGES.RESULT_SAVED, {
      score: scoreResult.score,
      totalPossible: scoreResult.totalPossible,
      percentage: scoreResult.percentage,
      passed: scoreResult.passed,
      resultId: result._id,
    });
  } catch (error) {
    logError('Submit quiz error', error);
    next(error);
  }
};

export const getUserResults: RequestHandler = async (req, res, next) => {
  try {
    const rawPage = parseInt(req.query.page as string, 10);
    const rawLimit = parseInt(req.query.limit as string, 10);
    const { skip, limit, page } = buildPagination(
      isNaN(rawPage) ? 1 : rawPage,
      isNaN(rawLimit) ? 10 : rawLimit
    );

    const [results, total] = await Promise.all([
      Result.find({ userId: req.userId })
        .populate('quizId', 'title category difficulty')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit),
      Result.countDocuments({ userId: req.userId }),
    ]);

    return sendSuccess(res, 200, 'Results fetched', results, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllResults: RequestHandler = async (req, res, next) => {
  try {
    const rawPage = parseInt(req.query.page as string, 10);
    const rawLimit = parseInt(req.query.limit as string, 10);
    const { skip, limit, page } = buildPagination(
      isNaN(rawPage) ? 1 : rawPage,
      isNaN(rawLimit) ? 20 : rawLimit
    );

    const [results, total] = await Promise.all([
      Result.find()
        .populate('userId', 'username email')
        .populate('quizId', 'title')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit),
      Result.countDocuments(),
    ]);

    return sendSuccess(res, 200, 'All results fetched', results, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard: RequestHandler = async (req, res, next) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $match: { 'user.role': 'user' } },
      {
        $group: {
          _id: '$userId',
          username: { $first: '$user.username' },
          totalScore: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          averagePercentage: { $avg: '$percentage' },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 50 },
      {
        $project: {
          _id: 1,
          username: 1,
          totalScore: 1,
          totalQuizzes: 1,
          averagePercentage: { $round: ['$averagePercentage', 2] },
        },
      },
    ]);

    return sendSuccess(res, 200, 'Leaderboard fetched', leaderboard);
  } catch (error) {
    next(error);
  }
};

export const getResultById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid result ID format');
    }

    const result = await Result.findById(id)
      .populate('userId', 'username email')
      .populate('quizId', 'title description');

    if (!result) return sendError(res, 404, 'Result not found');

    const ownerId = (result.userId as any)?._id?.toString() ?? result.userId.toString();
    if (req.userRole !== 'admin' && ownerId !== req.userId) {
      return sendError(res, 403, 'Access denied');
    }

    return sendSuccess(res, 200, 'Result fetched', result);
  } catch (error) {
    next(error);
  }
};
