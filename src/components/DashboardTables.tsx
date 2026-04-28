import React from 'react';
import { Link } from 'react-router-dom';
import { NeoButton } from './ui/NeoButton';

interface ActivityAttempt {
    _id: string;
    userId?: { username: string };
    quizId?: { title: string };
    percentage: number;
    completedAt: string;
}

export const ActivityTable: React.FC<{ data: ActivityAttempt[]; isAdmin: boolean }> = ({ data, isAdmin }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead><tr className="bg-orange-100 border-b-4 border-black">
                <th className="p-5 font-black uppercase text-xs">{isAdmin ? 'Student & Quiz' : 'Quiz Details'}</th>
                <th className="p-5 font-black uppercase text-xs">Result</th>
                <th className="p-5 font-black uppercase text-xs">Date</th>
                <th className="p-5 font-black uppercase text-xs text-center">Action</th>
            </tr></thead>
            <tbody>
                {data.map(attempt => (
                    <tr key={attempt._id} className="border-b-4 border-black hover:bg-yellow-50">
                        <td className="p-5"><div className="font-black text-lg">{isAdmin ? (attempt.userId?.username || 'Guest') : (attempt.quizId?.title || 'Untitled Quiz')}</div></td>
                        <td className="p-5"><div className={`inline-block px-4 py-1 rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${attempt.percentage >= 60 ? 'bg-green-400' : 'bg-red-400'}`}>{attempt.percentage}%</div></td>
                        <td className="p-5 font-bold italic">{new Date(attempt.completedAt).toLocaleDateString()}</td>
                        <td className="p-5 text-center"><Link to={`/results/${attempt._id}`}><NeoButton className="px-5 py-2 text-[11px] rounded-xl bg-yellow-400 hover:bg-[#5c94ff] hover:text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">VIEW DETAILS</NeoButton></Link></td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={4} className="p-8 text-center">No attempts yet.</td></tr>}
            </tbody>
        </table>
    </div>
);

interface AdminAttempt {
    _id: string;
    userId?: { username: string };
    quizId?: { title: string };
    percentage: number;
    score: number;
    totalPossibleScore: number;
    completedAt: string;
}

export const AdminTable: React.FC<{ data: AdminAttempt[] }> = ({ data }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead><tr className="bg-purple-100 border-b-4 border-black">
                <th className="p-5 font-black uppercase text-xs">Student</th><th className="p-5 font-black uppercase text-xs">Quiz</th><th className="p-5 font-black uppercase text-xs">Score</th><th className="p-5 font-black uppercase text-xs">Date</th><th className="p-5 font-black uppercase text-xs text-center">Action</th>
            </tr></thead>
            <tbody>
                {data.map(attempt => (
                    <tr key={attempt._id} className="border-b-4 border-black hover:bg-purple-50">
                        <td className="p-5 font-black">{attempt.userId?.username || 'Guest'}</td>
                        <td className="p-5">{attempt.quizId?.title || 'Deleted Quiz'}</td>
                        <td className="p-5"><span className="font-black">{attempt.percentage}%</span> ({attempt.score}/{attempt.totalPossibleScore})</td>
                        <td className="p-5 italic">{new Date(attempt.completedAt).toLocaleDateString()}</td>
                        <td className="p-5 text-center"><Link to={`/results/${attempt._id}`}><NeoButton className="px-4 py-1 text-xs">Details</NeoButton></Link></td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No attempts yet.</td></tr>}
            </tbody>
        </table>
    </div>
);

interface LeaderboardEntry {
    _id: string;
    username: string;
    totalScore: number;
    totalQuizzes: number;
    averagePercentage: number;
}

export const LeaderboardTable: React.FC<{ data: LeaderboardEntry[]; currentUserId?: string }> = ({ data, currentUserId }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead><tr className="bg-green-100 border-b-4 border-black">
                <th className="p-5 font-black uppercase text-xs">Rank</th><th className="p-5 font-black uppercase text-xs">Student</th><th className="p-5 font-black uppercase text-xs">Total Score</th><th className="p-5 font-black uppercase text-xs">Quizzes Taken</th><th className="p-5 font-black uppercase text-xs">Average %</th>
            </tr></thead>
            <tbody>
                {data.map((entry, idx) => (
                    <tr key={entry._id} className={`border-b-4 border-black ${entry._id === currentUserId ? 'bg-yellow-100' : ''}`}>
                        <td className="p-5 font-black text-center">{idx + 1}</td>
                        <td className="p-5 font-black">{entry.username} {entry._id === currentUserId && <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">You</span>}</td>
                        <td className="p-5">{Math.round(entry.totalScore)} pts</td>
                        <td className="p-5">{entry.totalQuizzes}</td>
                        <td className="p-5 font-black">{Math.round(entry.averagePercentage)}%</td>
                    </tr>
                ))}
                {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No data yet.</td></tr>}
            </tbody>
        </table>
    </div>
);