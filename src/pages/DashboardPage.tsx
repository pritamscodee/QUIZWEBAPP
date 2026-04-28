import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiService from '../services/api';
import { Navbar } from '../components/ui/Navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';
import { StatCard } from '../components/StatCard';

interface ActivityAttempt {
  _id: string;
  userId?: { _id: string; username: string };
  quizId?: { title: string };
  percentage: number;
  completedAt: string;
}

interface AdminAttempt {
  _id: string;
  userId?: { _id: string; username: string };
  quizId?: { title: string };
  percentage: number;
  score: number;
  totalPossibleScore: number;
  completedAt: string;
}

interface LeaderboardEntry {
  _id: string;
  username: string;
  totalScore: number;
  totalQuizzes: number;
  averagePercentage: number;
}

const ActivityTable: React.FC<{ data: ActivityAttempt[]; isAdmin: boolean }> = ({ data, isAdmin }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead><tr className="bg-orange-100 border-b-4 border-black"><th className="p-5 font-black uppercase text-xs">{isAdmin ? 'Student & Quiz' : 'Quiz Details'}</th><th className="p-5 font-black uppercase text-xs">Result</th><th className="p-5 font-black uppercase text-xs">Date</th><th className="p-5 font-black uppercase text-xs text-center">Action</th></tr></thead>
      <tbody>{data.map(attempt => (<tr key={attempt._id} className="border-b-4 border-black hover:bg-yellow-50"><td className="p-5"><div className="font-black text-lg">{isAdmin ? (attempt.userId?.username || 'Guest') : (attempt.quizId?.title || 'Untitled Quiz')}</div></td><td className="p-5"><div className={`inline-block px-4 py-1 rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${attempt.percentage >= 60 ? 'bg-green-400' : 'bg-red-400'}`}>{attempt.percentage}%</div></td><td className="p-5 font-bold italic">{new Date(attempt.completedAt).toLocaleDateString()}</td><td className="p-5 text-center"><Link to={`/results/${attempt._id}`}><NeoButton className="px-5 py-2 text-[11px] rounded-xl bg-yellow-400 hover:bg-[#5c94ff] hover:text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">VIEW DETAILS</NeoButton></Link></td></tr>))}{data.length === 0 && <tr><td colSpan={4} className="p-8 text-center">No attempts yet.</td></tr>}</tbody>
    </table>
  </div>
);

const AdminTable: React.FC<{ data: AdminAttempt[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead><tr className="bg-purple-100 border-b-4 border-black"><th className="p-5 font-black uppercase text-xs">Student</th><th className="p-5 font-black uppercase text-xs">Quiz</th><th className="p-5 font-black uppercase text-xs">Score</th><th className="p-5 font-black uppercase text-xs">Date</th><th className="p-5 font-black uppercase text-xs text-center">Action</th></tr></thead>
      <tbody>{data.map(attempt => (<tr key={attempt._id} className="border-b-4 border-black hover:bg-purple-50"><td className="p-5 font-black">{attempt.userId?.username || 'Guest'}</td><td className="p-5">{attempt.quizId?.title || 'Deleted Quiz'}</td><td className="p-5"><span className="font-black">{attempt.percentage}%</span> ({attempt.score}/{attempt.totalPossibleScore})</td><td className="p-5 italic">{new Date(attempt.completedAt).toLocaleDateString()}</td><td className="p-5 text-center"><Link to={`/results/${attempt._id}`}><NeoButton className="px-4 py-1 text-xs">Details</NeoButton></Link></td></tr>))}{data.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No attempts yet.</td></tr>}</tbody>
    </table>
  </div>
);

const LeaderboardTable: React.FC<{ data: LeaderboardEntry[]; currentUserId?: string }> = ({ data, currentUserId }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead><tr className="bg-green-100 border-b-4 border-black"><th className="p-5 font-black uppercase text-xs">Rank</th><th className="p-5 font-black uppercase text-xs">Student</th><th className="p-5 font-black uppercase text-xs">Total Score</th><th className="p-5 font-black uppercase text-xs">Quizzes Taken</th><th className="p-5 font-black uppercase text-xs">Average %</th></tr></thead>
      <tbody>{data.map((entry, idx) => (<tr key={entry._id} className={`border-b-4 border-black ${entry._id === currentUserId ? 'bg-yellow-100' : ''}`}><td className="p-5 font-black text-center">{idx + 1}</td><td className="p-5 font-black">{entry.username} {entry._id === currentUserId && <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">You</span>}</td><td className="p-5">{Math.round(entry.totalScore)} pts</td><td className="p-5">{entry.totalQuizzes}</td><td className="p-5 font-black">{Math.round(entry.averagePercentage)}%</td></tr>))}{data.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No data yet.</td></tr>}</tbody>
    </table>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, passed: 0 });
  const [adminStats, setAdminStats] = useState({ totalStudents: 0, totalAttempts: 0 });
  const [allResults, setAllResults] = useState<AdminAttempt[]>([]);
  const [myRecentResults, setMyRecentResults] = useState<ActivityAttempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRes = await apiService.results.getUserResults();
        const myResults = myRes.data.data || [];
        setMyRecentResults(myResults.slice(0, 10));
        const total = myResults.length;
        const avg = total ? myResults.reduce((s: number, r: any) => s + r.percentage, 0) / total : 0;
        const passed = myResults.filter((r: any) => r.percentage >= 60).length;
        setStats({ totalQuizzes: total, averageScore: Math.round(avg), passed });

        const leaderRes = await apiService.results.getLeaderboard();
        setLeaderboard(leaderRes.data.data || []);

        if (isAdmin) {
          const allRes = await apiService.results.getAllResults();
          const attempts = allRes.data.data || [];
          setAllResults(attempts);
          const uniqueStudents = new Set(attempts.map((a: any) => a.userId?._id).filter(Boolean));
          setAdminStats({ totalStudents: uniqueStudents.size, totalAttempts: attempts.length });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user, isAdmin]);

  if (loading) return <><Navbar /><div className="text-center py-12">Gathering your stats...</div></>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-black pb-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black mb-2 leading-tight">
              Hey there, <br />
              <span className="relative inline-block px-6 py-2 mt-2">
                <span className="relative z-10 italic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{user?.username}!</span>
                <div className="absolute inset-0 bg-[#5c94ff] border-4 border-black rounded-2xl -rotate-2 z-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                <Sparkle className="absolute -top-5 -left-5 text-yellow-400 w-10 h-10" />
                <Sparkle className="absolute -bottom-3 -right-5 text-green-400 w-8 h-8" />
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <NeoButton className={`rounded-full px-8 py-3 transition-all ${activeTab === 'overview' ? 'bg-yellow-400 text-black' : 'bg-orange-300 text-black'}`} onClick={() => setActiveTab('overview')}>Overview</NeoButton>
            {isAdmin && <NeoButton className={`rounded-full px-8 py-3 transition-all ${activeTab === 'admin' ? 'bg-purple-500 text-white' : 'bg-purple-300 text-black'}`} onClick={() => setActiveTab('admin')}>Admin Panel</NeoButton>}
            <NeoButton className={`rounded-full px-8 py-3 transition-all ${activeTab === 'leaderboard' ? 'bg-yellow-400 text-black' : 'bg-orange-300 text-black'}`} onClick={() => setActiveTab('leaderboard')}>Leaderboard</NeoButton>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {!isAdmin ? (
                  <><StatCard value={stats.totalQuizzes} label="Quizzes Taken" color="bg-orange-200" /><StatCard value={`${stats.averageScore}%`} label="Avg Score" color="bg-cyan-200" /><StatCard value={stats.passed} label="Passed" color="bg-green-300" /></>
                ) : (
                  <><StatCard value={adminStats.totalStudents} label="Total Students" color="bg-orange-200" /><StatCard value={adminStats.totalAttempts} label="Quiz Attempts" color="bg-purple-300" /><StatCard value="★" label="Admin Active" color="bg-indigo-300" /></>
                )}
              </div>
              <NeoCard className="rounded-[45px] overflow-hidden p-0 border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#f9f9f9]">
                <div className="relative py-12 px-6 bg-[#ebf2ff] border-b-4 border-black overflow-hidden">
                  <div className="absolute -left-2 top-6 bg-yellow-400 border-4 border-black px-8 py-2 rounded-xl -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2"><span className="text-2xl">🔥</span> <span>{!isAdmin ? 'Recent Attempts' : 'Student Activity'}</span></h2>
                  </div>
                </div>
                <ActivityTable data={isAdmin ? allResults.slice(0, 10) : myRecentResults} isAdmin={isAdmin} />
              </NeoCard>
            </>
          )}

          {isAdmin && activeTab === 'admin' && (
            <NeoCard className="rounded-[45px] overflow-hidden p-0 border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#f9f9f9]">
              <div className="relative py-12 px-6 bg-[#ebf2ff] border-b-4 border-black overflow-hidden">
                <div className="absolute -left-2 top-6 bg-purple-500 border-4 border-black px-8 py-2 rounded-xl -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 text-white">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">All Student Attempts</h2>
                </div>
              </div>
              <AdminTable data={allResults} />
            </NeoCard>
          )}

          {activeTab === 'leaderboard' && (
            <NeoCard className="rounded-[45px] overflow-hidden p-0 border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#f9f9f9]">
              <div className="relative py-12 px-6 bg-[#ebf2ff] border-b-4 border-black overflow-hidden">
                <div className="absolute -left-2 top-6 bg-green-400 border-4 border-black px-8 py-2 rounded-xl -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2"><span className="text-2xl">🏆</span> Student Leaderboard</h2>
                </div>
              </div>
              <LeaderboardTable data={leaderboard} currentUserId={user?._id} />
            </NeoCard>
          )}

          <div className="fixed bottom-8 right-8 group">
            <Link to="/quizzes">
              <div className="relative">
                <div className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1"></div>
                <button className="relative bg-green-400 text-black border-4 border-black h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center transition-all group-hover:-translate-y-2 group-hover:-translate-x-1 group-active:translate-y-0">
                  <span className="font-black text-3xl group-hover:rotate-12 transition-transform">+</span>
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}