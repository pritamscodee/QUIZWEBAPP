import { z } from 'zod';

export const usernameSchema = z.string().min(3).max(30);
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6);
export const userSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['user', 'admin']).default('user'),
});
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['Programming', 'Science', 'History', 'Mathematics', 'General']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  timeLimit: z.number().min(1).max(180),
  questions: z.array(z.object({
    questionText: z.string(),
    options: z.array(z.string().min(1)).length(4),
    correctAnswer: z.number().min(0).max(3),
    points: z.number().min(1),
  })).min(1),
});