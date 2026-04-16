/**
 * QUIZ CONTROLLER - NOW USING UTILS
 */

import Quiz from '../models/Quiz.js';
import { validateQuizStructure } from '../utils/quizHelper.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/responseHelper.js';
import { buildPagination, sanitizeQueryParams } from '../utils/dbHelper.js';
import { logInfo, logError } from '../utils/logger.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/constants.js';

// Get all published quizzes
export const getAllQuizzes = async (req, res, next) => {
    try {
        const { category, difficulty, page = 1, limit = 10 } = req.query;
        
        // USING UTILS: Build filter
        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        
        // USING UTILS: Sanitize query
        const sanitizedFilter = sanitizeQueryParams(filter);
        
        // USING UTILS: Build pagination
        const { skip, limit: validLimit, page: currentPage } = buildPagination(page, limit);
        
        const quizzes = await Quiz.find(sanitizedFilter)
            .select('-questions.correctAnswer')
            .skip(skip)
            .limit(validLimit)
            .sort({ createdAt: -1 });
        
        const total = await Quiz.countDocuments(sanitizedFilter);
        const totalPages = Math.ceil(total / validLimit);
        
        // USING UTILS: Send paginated response
        return sendPaginated(res, quizzes, currentPage, totalPages, total);
    } catch (error) {
        logError('Error fetching quizzes', error);
        next(error);
    }
};

// Get single quiz by ID
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('createdBy', 'username');
        
        if (!quiz) {
            return sendError(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.NOT_FOUND);
        }
        
        return sendSuccess(res, HTTP_STATUS.OK, 'Quiz fetched', quiz);
    } catch (error) {
        next(error);
    }
};

// Create new quiz
export const createQuiz = async (req, res, next) => {
    try {
        const quizData = { ...req.body, createdBy: req.userId };
        
        // USING UTILS: Validate quiz structure
        const validation = validateQuizStructure(quizData);
        if (!validation.isValid) {
            return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid quiz data', validation.errors);
        }
        
        const quiz = new Quiz(quizData);
        await quiz.save();
        
        logInfo(`New quiz created: ${quiz.title} by user ${req.userId}`);
        
        return sendSuccess(res, HTTP_STATUS.CREATED, RESPONSE_MESSAGES.QUIZ_CREATED, quiz);
    } catch (error) {
        logError('Quiz creation error', error);
        next(error);
    }
};