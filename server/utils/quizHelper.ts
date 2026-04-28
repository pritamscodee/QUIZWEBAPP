interface Question {
  _id?: string;
  questionText: string;
  correctAnswer: number;
  points: number;
}

interface DetailedAnswer {
  questionId?: string;
  questionText: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
}

export const calculateQuizScore = (questions: Question[], userAnswers: number[]) => {
  let totalScore = 0;
  const detailedAnswers: DetailedAnswer[] = [];
  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const pointsEarned = isCorrect ? question.points : 0;
    totalScore += pointsEarned;
    detailedAnswers.push({
      questionId: question._id,
      questionText: question.questionText,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      pointsEarned,
      maxPoints: question.points
    });
  });
  const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = (totalScore / totalPossiblePoints) * 100;
  return {
    score: totalScore,
    totalPossible: totalPossiblePoints,
    percentage: Math.round(percentage * 100) / 100,
    passed: percentage >= 60,
    detailedAnswers
  };
};
