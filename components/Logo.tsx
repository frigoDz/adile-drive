
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showIcon = false }) => {
  const iconSizes = {
    sm: 'w-10 h-10 text-[14px]',
    md: 'w-14 h-14 text-xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {showIcon && (
        <div className={`${iconSizes[size]} bg-slate-950 rounded-[24%] flex items-center justify-center font-black shadow-2xl shadow-blue-900/40 border-[3px] border-slate-800 transform hover:scale-105 transition-transform duration-300`}>
          <div className="flex leading-none tracking-tighter">
            <span className="text-white">A</span>
            <span className="text-blue-500">D</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`font-black tracking-tighter italic leading-none text-white ${textSizes[size]}`}>
            ADILE<span className="text-blue-500 ml-1">DRIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
