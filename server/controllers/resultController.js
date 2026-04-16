/**
 * RESULT CONTROLLER - NOW USING UTILS
 */

import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';
import { calculateQuizScore } from '../utils/quizHelper.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logInfo, logError } from '../utils/logger.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/constants.js';

// Submit quiz answers
export const submitQuiz = async (req, res, next) => {
    try {
        const { quizId, answers, timeTaken } = req.body;
        
        // Get quiz with correct answers
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return sendError(res, HTTP_STATUS.NOT_FOUND, 'Quiz not found');
        }
        
        // USING UTILS: Calculate score
        const scoreResult = calculateQuizScore(quiz.questions, answers);
        
        // Save result
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
        
        return sendSuccess(res, HTTP_STATUS.CREATED, RESPONSE_MESSAGES.RESULT_SAVED, {
            score: scoreResult.score,
            totalPossible: scoreResult.totalPossible,
            percentage: scoreResult.percentage,
            passed: scoreResult.passed,
            resultId: result._id
        });
    } catch (error) {
        logError('Quiz submission error', error);
        next(error);
    }
};

// Get user's results
export const getUserResults = async (req, res, next) => {
    try {
        const results = await Result.find({ userId: req.userId })
            .populate('quizId', 'title category difficulty')
            .sort({ completedAt: -1 });
        
        return sendSuccess(res, HTTP_STATUS.OK, 'Results fetched', results);
    } catch (error) {
        next(error);
    }
};