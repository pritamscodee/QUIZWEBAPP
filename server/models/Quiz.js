import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (options) => options.length === 4,
            message: 'Each question must have exactly 4 options'
        }
    },
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    points: {
        type: Number,
        default: 10,
        min: 1
    }
}, {
    timestamps: true
});
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    category: {
        type: String,
        required: true,
        enum: ['Programming', 'Science', 'History', 'Mathematics', 'General'],
        default: 'General'
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    questions: [questionSchema],
    totalPoints: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    timeLimit: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true
});
quizSchema.pre('save', function(next) {
    this.totalPoints = this.questions.reduce((total, q) => total + q.points, 0);
    next();
});
const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;