import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export function AchievementBadge({
  id,
  title,
  description,
  icon,
  unlocked,
  progress,
  total
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`relative transition-transform ${isHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center 
                ${unlocked ? 'bg-primary/10' : 'bg-gray-100'} 
                transition-all duration-300`}
            >
              <i 
                className={`fas ${icon} text-2xl
                  ${unlocked ? 'text-primary' : 'text-gray-400'}`}
              ></i>
              
              {!unlocked && progress !== undefined && total !== undefined && (
                <div className="absolute bottom-0 right-0 bg-background p-0.5 rounded-full border border-primary/20">
                  <div className="text-xs font-semibold text-gray-600">{progress}/{total}</div>
                </div>
              )}
              
              {unlocked && (
                <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center check-animate">
                  <i className="fas fa-check text-xs"></i>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-2 max-w-[200px]">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-gray-500">{description}</div>
          {!unlocked && progress !== undefined && total !== undefined && (
            <div className="text-xs mt-1">
              Progress: {progress}/{total}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}