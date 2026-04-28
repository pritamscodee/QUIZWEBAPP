import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { toast } from 'react-hot-toast';

const NeoSelect = ({ label, value, options, onChange, color = "bg-white" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative w-full" ref={ref}>
      <label className="block font-black uppercase text-[10px] tracking-widest ml-2 mb-1 text-gray-500">{label}</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full border-4 border-black rounded-xl p-3 font-black text-left flex justify-between items-center transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${color}`}>
        {value}<span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {options.map((opt: string) => (
            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className="p-3 font-bold border-b-2 border-black last:border-b-0 hover:bg-yellow-300 cursor-pointer">
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Question { questionText: string; options: string[]; correctAnswer: number; points: number; }

export default function CreateQuizPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: 'A comprehensive quiz about', // ✅ minimum 10 characters (backend requires ≥10)
    category: 'General',
    difficulty: 'Medium',
    timeLimit: 30,
    isPublished: true,
    questions: [] as Question[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Access denied');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const addQuestion = () => setQuiz({
    ...quiz,
    questions: [...quiz.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]
  });
  const updateQuestion = <K extends keyof Question>(idx: number, field: K, value: Question[K]) => {
    const qs = [...quiz.questions];
    qs[idx][field] = value;
    setQuiz({ ...quiz, questions: qs });
  };
  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const qs = [...quiz.questions];
    qs[qIdx].options[oIdx] = value;
    setQuiz({ ...quiz, questions: qs });
  };
  const removeQuestion = (idx: number) => setQuiz({ ...quiz, questions: quiz.questions.filter((_, i) => i !== idx) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.title.trim()) return toast.error('Title required');
    if (quiz.description.trim().length < 10) return toast.error('Description must be at least 10 characters');
    if (quiz.questions.length === 0) return toast.error('Add at least one question');
    setLoading(true);
    try {
      const response = await api.quizzes.create(quiz);
      console.log('Quiz created:', response.data);
      toast.success('Quiz created!');
      navigate('/quizzes');
    } catch (err: any) {
      console.error('Creation error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Creation failed');
    } finally { setLoading(false); }
  };

  if (user?.role !== 'admin') return null;

  const inputClass = "border-4 border-black rounded-xl p-3 w-full font-bold focus:bg-indigo-50 outline-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]";
  const labelClass = "block font-black uppercase text-[10px] tracking-widest ml-2 mb-1 text-gray-500";

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative mb-12 text-center">
          <div className="inline-block bg-purple-500 border-4 border-black px-10 py-3 rounded-2xl -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Create New Quiz</h1>
          </div>
        </div>
        <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div><label className={labelClass}>Title *</label><input className={inputClass} value={quiz.title} onChange={e => setQuiz({ ...quiz, title: e.target.value })} required /></div>

              {/* ✅ Added description field (backend requires min 10 characters) */}
              <div><label className={labelClass}>Description * (min 10 characters)</label>
                <textarea className={inputClass} rows={3} value={quiz.description} onChange={e => setQuiz({ ...quiz, description: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeoSelect label="Category" value={quiz.category} options={["Programming", "Science", "History", "Mathematics", "General"]} onChange={(val: string) => setQuiz({ ...quiz, category: val })} color="bg-indigo-50" />
                <NeoSelect label="Difficulty" value={quiz.difficulty} options={["Easy", "Medium", "Hard"]} onChange={(val: string) => setQuiz({ ...quiz, difficulty: val })} color="bg-indigo-50" />
                <div><label className={labelClass}>Time (min)</label><input type="number" className={inputClass} value={quiz.timeLimit} onChange={e => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })} /></div>
              </div>
            </div>
            <div className="border-t-4 border-black pt-10">
              <div className="flex justify-between mb-8">
                <div className="bg-yellow-400 border-4 border-black px-6 py-1 rounded-xl -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"><h3 className="font-black uppercase text-lg">Questions</h3></div>
                <NeoButton type="button" onClick={addQuestion} className="bg-green-400 rounded-full px-6 py-2 border-2 text-sm">+ Add</NeoButton>
              </div>
              <div className="space-y-8">
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="relative bg-indigo-50 border-4 border-black p-6 rounded-[35px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between mb-4"><span className="bg-black text-white px-4 py-1 rounded-full">Task #{idx + 1}</span><button type="button" onClick={() => removeQuestion(idx)} className="text-red-500">Remove</button></div>
                    <input placeholder="Question" className={`${inputClass} bg-white mb-4`} value={q.questionText} onChange={e => updateQuestion(idx, 'questionText', e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, oidx) => (
                        <div key={oidx} className="flex items-center gap-2">
                          <span className="font-black text-xs text-purple-500">{String.fromCharCode(65 + oidx)}</span>
                          <input placeholder={`Option ${String.fromCharCode(65 + oidx)}`} className={`${inputClass} py-2 text-sm`} value={opt} onChange={e => updateOption(idx, oidx, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <div className="flex-1">
                        <NeoSelect label="Correct" value={`Option ${String.fromCharCode(65 + q.correctAnswer)}`} options={["Option A", "Option B", "Option C", "Option D"]} onChange={(val: string) => { const i = val.endsWith('A') ? 0 : val.endsWith('B') ? 1 : val.endsWith('C') ? 2 : 3; updateQuestion(idx, 'correctAnswer', i); }} />
                      </div>
                      <div className="w-24"><label className={labelClass}>Points</label><input type="number" className={`${inputClass} py-2`} value={q.points} onChange={e => updateQuestion(idx, 'points', parseInt(e.target.value))} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-10">
              <NeoButton type="button" onClick={() => navigate('/quizzes')} className="bg-white">Cancel</NeoButton>
              <NeoButton type="submit" disabled={loading} className="bg-purple-500 text-white">{loading ? 'Processing...' : 'Launch Quiz'}</NeoButton>
            </div>
          </form>
        </NeoCard>
      </div>
    </>
  );
}