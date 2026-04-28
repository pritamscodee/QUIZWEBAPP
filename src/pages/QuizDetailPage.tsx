import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiService from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    apiService.quizzes.getById(id!)
      .then(res => setQuiz(res.data.data))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStart = () => {
    if (!isAuthenticated) navigate('/login');
    else navigate(`/quiz/${id}/take`);
  };

  if (loading) return <><Navbar /><div className="text-center py-12">Loading...</div></>;
  if (!quiz) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative mb-14 text-center">
          <div className="inline-block bg-[#5c94ff] border-4 border-black px-10 py-4 rounded-3xl -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{quiz.title}</h1>
          </div>
          <Sparkle className="absolute -top-6 -left-4 text-yellow-400 w-12 h-12" />
        </div>
        <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white mb-10">
          <p className="text-xl font-bold text-gray-700 mb-10 text-center">
            "{quiz.description || "Get ready!"}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-purple-200 border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase">Category</span>
              <span className="text-lg font-black">{quiz.category}</span>
            </div>
            <div className="bg-cyan-200 border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase">Difficulty</span>
              <span className="text-lg font-black">{quiz.difficulty}</span>
            </div>
            <div className="bg-yellow-300 border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase">Questions</span>
              <span className="text-lg font-black">{quiz.questions?.length}</span>
            </div>
            <div className="bg-green-300 border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase">Time Limit</span>
              <span className="text-lg font-black">{quiz.timeLimit}m</span>
            </div>
          </div>
          {isAdmin ? (
            <div>
              <div className="bg-black text-white px-6 py-2 rounded-t-2xl font-black uppercase">Admin Preview</div>
              <div className="bg-indigo-50 border-4 border-black p-6 space-y-6 rounded-b-3xl">
                {quiz.questions.map((q: any, idx: number) => (
                  <div key={idx} className="bg-white border-4 border-black p-5 rounded-[25px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between">
                      <span className="font-black">Q{idx + 1}</span>
                      <span>{q.points} pts</span>
                    </div>
                    <p className="font-black text-lg mb-2">{q.questionText}</p>
                    {q.options.map((opt: string, oidx: number) => (
                      <div key={oidx} className={`p-2 border-2 border-black rounded-xl flex items-center gap-2 ${oidx === q.correctAnswer ? 'bg-green-300' : 'bg-gray-50'}`}>
                        <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-lg text-[10px]">{String.fromCharCode(65 + oidx)}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <NeoButton onClick={handleStart} className="w-full md:w-80 py-6 text-2xl bg-[#5c94ff] text-white rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase italic font-black">
                Start Mission!
              </NeoButton>
              <Link to="/quizzes" className="font-black uppercase text-xs underline">Back to Library</Link>
            </div>
          )}
        </NeoCard>
      </div>
    </>
  );
}