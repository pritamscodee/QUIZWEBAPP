import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiService from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function QuizListPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  const fetchQuizzes = () => {
    setLoading(true);
    apiService.quizzes.getAll()
      .then(res => setQuizzes(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [location.key]); // refetch when navigation changes (e.g., after creating a quiz)

  if (loading) return <><Navbar /><div className="text-center py-12">Loading quizzes...</div></>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="relative mb-16 text-center">
          <div className="inline-block bg-[#5c94ff] border-4 border-black px-12 py-4 rounded-3xl -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Quiz Library</h1>
          </div>
          <Sparkle className="absolute -top-6 left-1/3 text-yellow-400 w-10 h-10" />
          <Sparkle className="absolute -bottom-4 right-1/3 text-green-400 w-8 h-8" />
          <button onClick={fetchQuizzes} className="absolute -bottom-12 right-0 text-xs font-black uppercase bg-yellow-300 border-2 border-black px-4 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400">
            ↻ Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {quizzes.map(quiz => (
            <NeoCard key={quiz._id} className="flex flex-col h-full rounded-[40px] border-4 bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-1 transition-all duration-200 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-200 border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{quiz.category}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${quiz.difficulty === 'Hard' ? 'bg-red-400' : quiz.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}>{quiz.difficulty}</span>
              </div>
              <div className="flex-grow"><h3 className="text-2xl font-black mb-3 italic group-hover:text-[#5c94ff] transition-colors leading-tight">{quiz.title}</h3><p className="text-gray-600 font-bold text-sm leading-relaxed mb-6">{quiz.description || "No description"}</p></div>
              <div className="bg-indigo-50 border-4 border-black rounded-2xl p-4 flex justify-between items-center mb-6"><div><span className="text-[9px] font-black uppercase text-gray-400">Questions</span><span className="font-black text-lg">{quiz.questions?.length || 0}</span></div><div className="w-[2px] h-8 bg-black/10"></div><div className="flex flex-col items-end"><span className="text-[9px] font-black uppercase text-gray-400">Total Reward</span><span className="font-black text-lg text-purple-600">{quiz.totalPoints || 0} PTS</span></div></div>
              <Link to={`/quizzes/${quiz._id}`}><NeoButton className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-[#5c94ff] hover:text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic tracking-tighter">{isAdmin ? 'Review' : 'Start Quiz'}</NeoButton></Link>
            </NeoCard>
          ))}
          {quizzes.length === 0 && <div className="col-span-full text-center py-20"><div className="text-6xl mb-4">📭</div><h2 className="text-2xl font-black uppercase italic">No quizzes yet!</h2></div>}
        </div>
      </div>
    </>
  );
}