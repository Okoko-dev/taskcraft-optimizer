
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={`w-full h-2 bg-taskace-gray/30 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
