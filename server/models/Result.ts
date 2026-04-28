import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswerDetail {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  score: number;
  totalPossibleScore: number;
  percentage: number;
  answers: IAnswerDetail[];
  timeTaken: number;
  completedAt: Date;
}

const answerDetailSchema = new Schema<IAnswerDetail>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  pointsEarned: { type: Number, required: true }
});

const resultSchema = new Schema<IResult>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true, min: 0 },
  totalPossibleScore: { type: Number, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  answers: [answerDetailSchema],
  timeTaken: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

resultSchema.index({ userId: 1, quizId: 1 });
resultSchema.index({ completedAt: -1 });

export default mongoose.model<IResult>('Result', resultSchema);
