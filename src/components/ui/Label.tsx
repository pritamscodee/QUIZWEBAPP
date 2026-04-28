import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => (
    <label
      ref={ref}
      className={`block font-black uppercase text-[10px] tracking-widest ml-2 mb-1 text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
);
Label.displayName = 'Label';






