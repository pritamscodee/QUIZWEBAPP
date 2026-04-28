import { RequestHandler } from 'express';
import Result from '../models/Result';
import Quiz from '../models/Quiz';
import { calculateQuizScore } from '../utils/quizHelper';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { logInfo, logError } from '../utils/logger';

export const submitQuiz: RequestHandler = async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return sendError(res, 404, 'Quiz not found');
    const scoreResult = calculateQuizScore(quiz.questions, answers);
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
        pointsEarned: a.pointsEarned
      })),
      timeTaken
    });
    await result.save();
    logInfo(`Quiz submitted: User ${req.userId} scored ${scoreResult.score}/${scoreResult.totalPossible}`);
    return sendSuccess(res, 201, 'Quiz result saved', {
      score: scoreResult.score,
      totalPossible: scoreResult.totalPossible,
      percentage: scoreResult.percentage,
      passed: scoreResult.passed,
      resultId: result._id
    });
  } catch (error) { next(error); }
};

export const getUserResults: RequestHandler = async (req, res, next) => {
  try {
    const results = await Result.find({ userId: req.userId })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });
    return sendSuccess(res, 200, 'Results fetched', results);
  } catch (error) { next(error); }
};

export const getAllResults: RequestHandler = async (req, res, next) => {
  if (req.userRole !== 'admin') return sendError(res, 403, 'Admin access required');
  try {
    const results = await Result.find()
      .populate('userId', 'username email')
      .populate('quizId', 'title')
      .sort({ completedAt: -1 });
    return sendSuccess(res, 200, 'All results fetched', results);
  } catch (error) { next(error); }
};

export const getLeaderboard: RequestHandler = async (req, res, next) => {
  try {
    const leaderboard = await Result.aggregate([
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $match: { 'user.role': 'user' } },
      { $group: { _id: '$userId', username: { $first: '$user.username' }, totalScore: { $sum: '$score' }, totalQuizzes: { $sum: 1 }, averagePercentage: { $avg: '$percentage' } } },
      { $sort: { totalScore: -1 } },
      { $limit: 50 }
    ]);
    return sendSuccess(res, 200, 'Leaderboard fetched', leaderboard);
  } catch (error) { next(error); }
};

export const getResultById: RequestHandler = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('quizId', 'title description');
    if (!result) return sendError(res, 404, 'Result not found');
    if (req.userRole !== 'admin' && result.userId._id.toString() !== req.userId) {
      return sendError(res, 403, 'Access denied');
    }
    return sendSuccess(res, 200, 'Result fetched', result);
  } catch (error) { next(error); }
};