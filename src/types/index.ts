export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  role?: 'user' | 'admin';
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: Question[];
  totalPoints: number;
  timeLimit: number;
  createdBy: User;
  isPublished: boolean;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
  points: number;
  _id?: string;
}

export interface Result {
  _id: string;
  userId: User;
  quizId: Quiz;
  score: number;
  totalPossibleScore: number;
  percentage: number;
  answers: AnswerDetail[];
  timeTaken: number;
  completedAt: string;
}

export interface AnswerDetail {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
}
