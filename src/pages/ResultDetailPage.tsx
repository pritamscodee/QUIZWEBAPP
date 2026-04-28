import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';

export default function ResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.results.getById(id!)
      .then(res => setResult(res.data.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <><Navbar /><div className="text-center py-12">Loading...</div></>;
  if (!result) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NeoCard>
          <h1 className="text-3xl font-black mb-2">Quiz Result Details</h1>
          <div className="space-y-3 mb-6">
            <p><span className="font-bold">Student:</span> {result.userId?.username}</p>
            <p><span className="font-bold">Quiz:</span> {result.quizId?.title}</p>
            <p><span className="font-bold">Score:</span> {result.score}/{result.totalPossibleScore} ({result.percentage}%)</p>
            <p><span className="font-bold">Completed:</span> {new Date(result.completedAt).toLocaleString()}</p>
            <p><span className="font-bold">Time taken:</span> {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
          </div>
          <h2 className="text-2xl font-black mb-3">Answers</h2>
          <div className="space-y-4">
            {result.answers?.map((ans: any, idx: number) => (
              <div key={idx} className="border-2 border-black p-4">
                <p className="font-bold">Question {idx + 1}</p>
                <p>Selected: {ans.selectedAnswer !== undefined ? `Option ${String.fromCharCode(65 + ans.selectedAnswer)}` : 'Not answered'}</p>
                <p className={ans.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {ans.isCorrect ? 'Correct' : 'Incorrect'} ({ans.pointsEarned}/{ans.maxPoints} pts)
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <NeoButton variant="secondary" onClick={() => navigate('/dashboard')}>Back</NeoButton>
          </div>
        </NeoCard>
      </div>
    </>
  );
}