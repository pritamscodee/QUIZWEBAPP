import React from 'react';
import { Link } from 'react-router-dom';
import { NeoButton } from './NeoButton';

interface Attempt {
  _id: string;
  userId?: { username: string };
  quizId?: { title: string };
  percentage: number;
  completedAt: string;
}

interface ActivityTableProps {
  data: Attempt[];
  isAdmin: boolean;
  title: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ data, isAdmin, title }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-orange-100 border-b-4 border-black">
            <th className="p-5 font-black uppercase text-xs tracking-widest text-black">
              {isAdmin ? 'Student & Quiz' : 'Quiz Details'}
            </th>
            <th className="p-5 font-black uppercase text-xs tracking-widest text-black">Result</th>
            <th className="p-5 font-black uppercase text-xs tracking-widest text-black">Date</th>
            <th className="p-5 font-black uppercase text-xs tracking-widest text-center">Action</th>
           </tr>
        </thead>
        <tbody>
          {data.map((attempt: any) => (
            <tr key={attempt._id} className="border-b-4 border-black last:border-0 hover:bg-yellow-50 transition-colors group">
              <td className="p-5">
                <div className="font-black text-lg group-hover:text-[#5c94ff] transition-colors">
                  {isAdmin ? (attempt.userId?.username || 'Guest') : (attempt.quizId?.title || 'Untitled Quiz')}
                </div>
              </td>
              <td className="p-5">
                <div className={`inline-block px-4 py-1 rounded-full border-2 border-black font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${attempt.percentage >= 60 ? 'bg-green-400' : 'bg-red-400'}`}>
                  {attempt.percentage}%
                </div>
              </td>
              <td className="p-5 font-bold text-black text-sm italic">
                {new Date(attempt.completedAt).toLocaleDateString()}
              </td>
              <td className="p-5 text-center">
                <Link to={`/results/${attempt._id}`}>
                  <NeoButton className="px-5 py-2 text-[11px] rounded-xl bg-yellow-400 hover:bg-[#5c94ff] hover:text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    VIEW DETAILS
                  </NeoButton>
                </Link>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={4} className="p-8 text-center font-black">No attempts yet. Take a quiz!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};











