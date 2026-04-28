import React from 'react';
import { NeoCard } from './ui/NeoCard';

interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
  textColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color, textColor = "text-black" }) => (
  <NeoCard className={`${color} rounded-[35px] border-4 flex flex-col items-center justify-center p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`}>
    <div className={`text-5xl font-black mb-1 ${textColor} italic tracking-tighter`}>{value}</div>
    <div className={`font-black uppercase text-[10px] tracking-widest ${textColor} opacity-90 text-center leading-tight`}>
      {label}
    </div>
  </NeoCard>
);











