import React from 'react';
import { Link } from 'react-router-dom';
import { NeoButton } from './NeoButton';

interface AllAttempt {
  _id: string;
  userId?: { username: string };
  quizId?: { title: string };
  percentage: number;
  score: number;
  totalPossibleScore: number;
  completedAt: string;
}

interface AdminTableProps {
  data: AllAttempt[];
}

export const AdminTable: React.FC<AdminTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple-100 border-b-4 border-black">
            <th className="p-5 font-black uppercase text-xs">Student</th>
            <th className="p-5 font-black uppercase text-xs">Quiz</th>
            <th className="p-5 font-black uppercase text-xs">Score</th>
            <th className="p-5 font-black uppercase text-xs">Date</th>
            <th className="p-5 font-black uppercase text-xs text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((attempt: any) => (
            <tr key={attempt._id} className="border-b-4 border-black hover:bg-purple-50 transition-colors">
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
};











