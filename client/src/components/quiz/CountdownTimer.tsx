import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export default function CountdownTimer({ initialTime, onTimeUp, isActive }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // Reset timer when initialTime changes or component unmounts
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);
  
  // Timer logic
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isActive]);
  
  // Calculate color based on time left
  const getTimerColor = () => {
    const percentLeft = (timeLeft / initialTime) * 100;
    if (percentLeft > 65) return 'bg-green-500';
    if (percentLeft > 30) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Circular Timer */}
      <div className="relative w-14 h-14 mb-1">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          
          {/* Progress circle */}
          <circle
            className={`${getTimerColor()} transition-all duration-1000 ease-linear`}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            strokeDasharray={264}
            strokeDashoffset={264 - (timeLeft / initialTime) * 264}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}