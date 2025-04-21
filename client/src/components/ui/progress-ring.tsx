import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  strokeWidth?: number;
  showLabel?: boolean;
  labelClassName?: string;
  color?: string;
}

export function ProgressRing({
  percent,
  size = 'md',
  className,
  strokeWidth = 4,
  showLabel = true,
  labelClassName,
  color = 'var(--brand-primary)'
}: ProgressRingProps) {
  // Ensure percent is between 0 and 100
  const normalizedPercent = Math.min(100, Math.max(0, percent));
  
  // Size mappings
  const sizeMap = {
    sm: 64,
    md: 100,
    lg: 160
  };
  
  const dimensions = sizeMap[size];
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;
  
  // Font size based on ring size
  const fontSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={dimensions}
        height={dimensions}
        viewBox={`0 0 ${dimensions} ${dimensions}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--grey-border)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      
      {/* Percentage text */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-semibold", fontSize[size], labelClassName)}>
            {normalizedPercent}%
          </span>
        </div>
      )}
    </div>
  );
}