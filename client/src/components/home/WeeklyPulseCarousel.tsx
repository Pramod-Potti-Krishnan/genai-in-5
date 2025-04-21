import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { weeklyPulseData } from "@/lib/leaderboard-data";
import { formatDuration } from "@/lib/utils";
import { HomeAudible } from "./types";

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
    <Card className="min-w-[260px] max-w-[260px] h-[180px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="h-20 w-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center"
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
  playAudible: (audible: Audible) => void;
}

export default function WeeklyPulseCarousel({ playAudible }: WeeklyPulseCarouselProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Weekly Pulse</h2>
      <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {weeklyPulseData.map((pulse) => (
          <WeeklyPulseCard key={pulse.id} pulse={pulse} onClick={playAudible} />
        ))}
      </div>
    </div>
  );
}