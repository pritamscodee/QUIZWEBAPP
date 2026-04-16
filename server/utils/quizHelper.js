export const calculateQuizScore = (questions, userAnswers) => {
    let totalScore = 0;
    const detailedAnswers = [];
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        const pointsEarned = isCorrect ? question.points : 0;
        
        totalScore += pointsEarned;
        
        detailedAnswers.push({
            questionId: question._id,
            questionText: question.questionText,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            pointsEarned: pointsEarned,
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
        detailedAnswers: detailedAnswers
    };
};

export const validateQuizStructure = (quiz) => {
    const errors = [];
    if (!quiz.title || quiz.title.length < 3) {
        errors.push('Quiz title must be at least 3 characters');
    }
    if (!quiz.questions || quiz.questions.length === 0) {
        errors.push('Quiz must have at least one question');
    }
    quiz.questions?.forEach((question, index) => {
        if (!question.questionText) {
            errors.push(`Question ${index + 1} has no text`);
        }
        if (!question.options || question.options.length !== 4) {
            errors.push(`Question ${index + 1} must have exactly 4 options`);
        }
        if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer > 3) {
            errors.push(`Question ${index + 1} has invalid correct answer`);
        }
    });
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};