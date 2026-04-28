import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`border-4 border-black rounded-xl p-3 w-full font-bold focus:bg-indigo-50 outline-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';






