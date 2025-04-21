import React from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  progressColor?: string;
  label?: React.ReactNode;
}

export function ProgressRing({
  percent,
  size = 100,
  strokeWidth = 8,
  bgColor = "#e5e7eb",
  progressColor = "currentColor",
  label
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          className="text-muted stroke-current"
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <circle
          className="text-primary stroke-current transition-all duration-300 ease-in-out"
          stroke={progressColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label}
        </div>
      )}
    </div>
  );
}