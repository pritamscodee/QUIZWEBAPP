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
    const isValidAnswer = typeof userAnswer === 'number' && userAnswer >= 0 && userAnswer <= 3;
    const isCorrect = isValidAnswer && userAnswer === question.correctAnswer;
    const pointsEarned = isCorrect ? question.points : 0;
    totalScore += pointsEarned;

    detailedAnswers.push({
      questionId: question._id,
      questionText: question.questionText,
      userAnswer: isValidAnswer ? userAnswer : -1,
      correctAnswer: question.correctAnswer,
      isCorrect,
      pointsEarned,
      maxPoints: question.points,
    });
  });

  const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);

  const percentage =
    totalPossiblePoints > 0
      ? Math.round((totalScore / totalPossiblePoints) * 10000) / 100
      : 0;

  return {
    score: totalScore,
    totalPossible: totalPossiblePoints,
    percentage,
    passed: percentage >= 60,
    detailedAnswers,
  };
};
