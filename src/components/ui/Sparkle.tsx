import React from 'react';

interface SparkleProps extends React.SVGProps<SVGSVGElement> {}

export const Sparkle: React.FC<SparkleProps> = ({ className = '', ...props }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);






