import React from 'react';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  bg?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className = '', 
  bg = "bg-white", 
  ...props 
}) => (
  <div className={`brutal-border brutal-shadow ${bg} p-6 ${className}`} {...props}>
    {children}
  </div>
);






