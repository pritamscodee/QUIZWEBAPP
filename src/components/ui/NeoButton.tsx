import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: "bg-[#5c94ff] text-white",
    secondary: "bg-white text-black",
    accent: "bg-yellow-400 text-black",
  };
  return (
    <button
      onClick={onClick}
      className={`brutal-border brutal-shadow-sm brutal-interactive px-6 py-2 font-black uppercase tracking-tight ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};






