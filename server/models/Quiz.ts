import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: IQuestion[];
  totalPoints: number;
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  timeLimit: number;
}

const questionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true, trim: true },
  options: { type: [String], required: true, validate: [(val: string[]) => val.length === 4, 'Exactly 4 options required'] },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  points: { type: Number, default: 10, min: 1 }
}, { timestamps: true });

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
  category: { type: String, required: true, enum: ['Programming', 'Science', 'History', 'Mathematics', 'General'], default: 'General' },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublished: { type: Boolean, default: true },   // ✅ changed from false to true
  timeLimit: { type: Number, default: 30 }
}, { timestamps: true });

quizSchema.pre('save', function (next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);