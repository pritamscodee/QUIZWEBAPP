import React from 'react';

interface LeaderboardEntry {
  _id: string;
  username: string;
  totalScore: number;
  totalQuizzes: number;
  averagePercentage: number;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, currentUserId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-green-100 border-b-4 border-black">
            <th className="p-5 font-black uppercase text-xs">Rank</th>
            <th className="p-5 font-black uppercase text-xs">Student</th>
            <th className="p-5 font-black uppercase text-xs">Total Score</th>
            <th className="p-5 font-black uppercase text-xs">Quizzes Taken</th>
            <th className="p-5 font-black uppercase text-xs">Average %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx: any) => (
            <tr key={entry._id} className={`border-b-4 border-black hover:bg-green-50 transition-colors ${entry._id === currentUserId ? 'bg-yellow-100' : ''}`}>
              <td className="p-5 font-black text-center">{idx+1}</td>
              <td className="p-5 font-black">{entry.username} {entry._id === currentUserId && <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">You</span>}</td>
              <td className="p-5">{Math.round(entry.totalScore)} pts</td>
              <td className="p-5">{entry.totalQuizzes}</td>
              <td className="p-5 font-black">{Math.round(entry.averagePercentage)}%</td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No data yet. Students need to take quizzes.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};











