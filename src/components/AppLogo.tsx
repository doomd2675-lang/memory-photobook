import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'h-8 w-8', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform hover:scale-105"
        aria-label="Us & Ours emblem"
      >
        {/* Soft atmospheric glow */}
        <circle cx="24" cy="24" r="23" fill="#f8ebe6" stroke="#dbc1b9" strokeWidth="1" />
        
        {/* Left tender ring (terracotta warmth) */}
        <path
          d="M19 16C15.134 16 12 19.134 12 23C12 28.5 19 33.5 24 36C21.5 31 16.5 27 16.5 23C16.5 20.79 18.29 19 20.5 19C22.3 19 23.8 20.2 24.3 21.8"
          stroke="#99462a"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right tender ring (sage eucalyptus) */}
        <path
          d="M29 16C32.866 16 36 19.134 36 23C36 28.5 29 33.5 24 36C26.5 31 31.5 27 31.5 23C31.5 20.79 29.71 19 27.5 19C25.7 19 24.2 20.2 23.7 21.8"
          stroke="#4b6453"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interlocking center nexus spark */}
        <circle cx="24" cy="21.5" r="2.25" fill="#d97757" />
        <circle cx="24" cy="29" r="1.5" fill="#8c4f23" opacity="0.6" />
      </svg>
    </div>
  );
};
