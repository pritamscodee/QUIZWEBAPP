import { z } from 'zod';

export const usernameSchema = z.string().min(3).max(30);
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6).max(128);

export const userSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const quizSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(['Programming', 'Science', 'History', 'Mathematics', 'General']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  timeLimit: z.number().int().min(1).max(180),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(5).max(500),
        options: z.array(z.string().min(1).max(200)).length(4),
        correctAnswer: z.number().int().min(0).max(3),
        points: z.number().int().min(1).max(100),
      })
    )
    .min(1)
    .max(50),
});

export const submitQuizSchema = z.object({
  quizId: z.string().min(1, 'quizId is required'),
  answers: z
    .array(z.number().int().min(0).max(3))
    .min(1, 'answers array cannot be empty'),
  timeTaken: z.number().int().min(0).max(86400),
});
