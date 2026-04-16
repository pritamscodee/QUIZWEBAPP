import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    totalPossibleScore: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: Number,
        isCorrect: Boolean,
        pointsEarned: Number
    }],
    timeTaken: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
resultSchema.index({ userId: 1, quizId: 1 });
resultSchema.index({ completedAt: -1 });
const Result = mongoose.model('Result', resultSchema);
export default Result;