import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { weeklyPulseData } from "@/lib/leaderboard-data";
import { formatDuration } from "@/lib/utils";
import { HomeAudible } from "./types";
import { useRef, useState, useEffect } from "react";

interface WeeklyPulseCardProps {
  pulse: typeof weeklyPulseData[0];
  onClick: (audible: HomeAudible) => void;
}

const WeeklyPulseCard = ({ pulse, onClick }: WeeklyPulseCardProps) => {
  const handleClick = () => {
    // Convert the pulse to an Audible for the audio player
    const audible: HomeAudible = {
      id: pulse.id,
      title: pulse.title,
      summary: pulse.summary,
      duration: pulse.duration,
      coverImage: pulse.coverImage || null,
      audioUrl: pulse.audioUrl,
      sectionId: "weekly-pulse"
    };
    
    onClick(audible);
  };

  return (
    <Card className="min-w-[280px] max-w-[280px] h-[200px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="h-24 w-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center"
          style={{
            backgroundImage: pulse.coverImage ? `url(${pulse.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!pulse.coverImage && (
            <span className="text-white font-bold text-xl">Weekly Pulse</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{pulse.date}</div>
          <h3 className="text-sm font-medium mb-1 line-clamp-1">{pulse.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{pulse.summary}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formatDuration(pulse.duration)}</span>
            <Button 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleClick}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface WeeklyPulseCarouselProps {
  playAudible: (audible: HomeAudible) => void;
}

export default function WeeklyPulseCarousel({ playAudible }: WeeklyPulseCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Handle keyboard navigation
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carousel.contains(document.activeElement)) return;
      
      const SCROLL_AMOUNT = 300; // Amount to scroll with arrow keys
      
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
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  };

  return (
    <div className="mb-6">
      <div className="-mx-4 px-4 pb-4">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide touch-pan-x"
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
          aria-label="Weekly Pulse audio content"
        >
          {weeklyPulseData.map((pulse) => (
            <WeeklyPulseCard key={pulse.id} pulse={pulse} onClick={playAudible} />
          ))}
        </div>
      </div>
    </div>
  );
}