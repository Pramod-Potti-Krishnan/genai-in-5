import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export default function CountdownTimer({ initialTime, onTimeUp, isActive }: CountdownTimerProps) {
  const [time, setTime] = useState(initialTime);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);
  
  // Reset timer when isActive changes from false to true
  useEffect(() => {
    if (isActive) {
      setTime(initialTime);
    }
  }, [isActive, initialTime]);
  
  // Determine color based on remaining time
  const getTimerColor = () => {
    if (time > initialTime * 0.6) return 'text-green-500';
    if (time > initialTime * 0.3) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Calculate percentage for the progress circle
  const circumference = 2 * Math.PI * 20; // r=20
  const progress = (time / initialTime) * circumference;
  
  return (
    <div className="relative flex items-center justify-center h-14 w-14">
      {/* SVG Progress Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={`transition-all duration-1000 ${getTimerColor()}`}
        />
      </svg>
      
      {/* Timer text and icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Timer className={`h-4 w-4 ${getTimerColor()}`} />
        <span className={`text-sm font-bold ${getTimerColor()}`}>{time}</span>
      </div>
    </div>
  );
}