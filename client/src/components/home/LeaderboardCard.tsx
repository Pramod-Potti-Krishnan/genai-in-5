import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LeaderboardMetric, userStats } from "@/lib/leaderboard-data";
import { CountUp } from "@/components/ui/count-up";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useEffect, useState, useRef } from "react";

interface MetricCardProps {
  metric: LeaderboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className = "" }: MetricCardProps) => {
  // Calculate random progress values for the background ring (60-90%)
  const [ringProgress, setRingProgress] = useState(75);
  
  useEffect(() => {
    // Generate a random value for the background ring between 60-90%
    setRingProgress(Math.floor(Math.random() * 30) + 60);
  }, []);

  // Parse the numeric value for CountUp component
  const numericValue = typeof metric.value === 'string' 
    ? parseInt(metric.value.replace(/[^0-9]/g, '')) 
    : metric.value;

  return (
    <div className={`rounded-lg bg-muted/50 p-3 flex items-center min-w-[150px] flex-shrink-0 ${className}`}>
      <div className="mr-3 flex justify-center items-center">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <ProgressRing 
            percent={ringProgress} 
            size={40} 
            strokeWidth={3} 
            progressColor="var(--primary)"
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary text-lg">
            {metric.icon}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{metric.title}</div>
        <div className="text-xs text-muted-foreground">
          <CountUp 
            end={numericValue} 
            duration={1000}
            prefix={typeof metric.value === 'string' && metric.value.startsWith('$') ? '$' : ''}
            suffix={typeof metric.value === 'string' && metric.value.endsWith('h') ? 'h' : ''}
          />
        </div>
        <div className="text-xs font-semibold text-primary">Top {metric.rank}%</div>
      </div>
    </div>
  );
};

export default function LeaderboardCard() {
  const [, setLocation] = useLocation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleClick = () => {
    // Only navigate if we didn't just finish dragging
    if (!isDragging) {
      setLocation("/progress");
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carousel.contains(document.activeElement)) return;
      
      const SCROLL_AMOUNT = 200; // Amount to scroll with arrow keys
      
      switch (e.key) {
        case 'ArrowRight':
          carousel.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          carousel.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
          e.preventDefault();
          break;
      }
    };
    
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', handleKeyDown);
    
    return () => {
      carousel.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle mouse events for desktop dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    e.stopPropagation(); // Prevent clicking the parent to navigate
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
    
    e.stopPropagation(); // Prevent clicking the parent to navigate
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    document.body.style.userSelect = '';
    
    // If we just dragged, don't treat this as a click
    if (Math.abs(scrollLeft - carouselRef.current?.scrollLeft!) > 5) {
      e.stopPropagation();
    }
    
    // Reset drag state after a short delay
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  };

  return (
    <div className="mb-4" onClick={handleClick}>
      <div className="px-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          <span className="inline-flex items-center">
            <span className="icon mr-2">🏆</span>
            Global Leaderboard
          </span>
        </h2>
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2 snap-x snap-mandatory touch-pan-x"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Global Leaderboard metrics"
        >
          <MetricCard metric={userStats.progressRank} className="snap-start" />
          <MetricCard metric={userStats.weeklyScore} className="snap-start" />
          <MetricCard metric={userStats.monthlyRank} className="snap-start" />
        </div>
      </div>
    </div>
  );
}