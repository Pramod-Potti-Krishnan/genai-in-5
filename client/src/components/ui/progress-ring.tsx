import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  strokeWidth?: number;
  showLabel?: boolean;
  labelClassName?: string;
  color?: string;
  progressColor?: string; // For backward compatibility
}

export function ProgressRing({
  percent,
  size = 'md',
  className,
  strokeWidth = 4,
  showLabel = true,
  labelClassName,
  color,
  progressColor = 'var(--brand-primary)'
}: ProgressRingProps) {
  // Ensure percent is between 0 and 100
  const normalizedPercent = Math.min(100, Math.max(0, percent || 0));
  
  // Size mappings
  const sizeMap = {
    sm: 64,
    md: 100,
    lg: 160
  };
  
  // Use the progressColor if color is not specified (for backward compatibility)
  const circleColor = color || progressColor;
  
  // Handle numeric size or string preset
  let dimensions = 100;
  if (typeof size === 'number') {
    dimensions = size;
  } else if (typeof size === 'string' && size in sizeMap) {
    dimensions = sizeMap[size as keyof typeof sizeMap];
  }
  
  const radius = Math.max(1, (dimensions - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;
  
  // Font size based on ring size
  let fontSizeClass = 'text-sm';
  if (typeof size === 'string' && size in sizeMap) {
    if (size === 'md') fontSizeClass = 'text-lg';
    if (size === 'lg') fontSizeClass = 'text-2xl';
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={dimensions.toString()}
        height={dimensions.toString()}
        viewBox={`0 0 ${dimensions} ${dimensions}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={String(dimensions / 2)}
          cy={String(dimensions / 2)}
          r={String(radius)}
          fill="none"
          stroke="var(--grey-border)"
          strokeWidth={String(strokeWidth)}
        />
        
        {/* Progress circle */}
        <circle
          cx={String(dimensions / 2)}
          cy={String(dimensions / 2)}
          r={String(radius)}
          fill="none"
          stroke={circleColor}
          strokeWidth={String(strokeWidth)}
          strokeDasharray={String(circumference)}
          strokeDashoffset={String(strokeDashoffset)}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      
      {/* Percentage text */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-semibold", fontSizeClass, labelClassName)}>
            {normalizedPercent}%
          </span>
        </div>
      )}
    </div>
  );
}