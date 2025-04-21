import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { monthlyRoundupData } from "@/lib/leaderboard-data";
import { formatDuration } from "@/lib/utils";
import { HomeAudible } from "./types";

interface MonthlyRoundupCardProps {
  roundup: typeof monthlyRoundupData[0];
  onClick: (audible: HomeAudible) => void;
}

const MonthlyRoundupCard = ({ roundup, onClick }: MonthlyRoundupCardProps) => {
  const handleClick = () => {
    // Convert the roundup to an Audible for the audio player
    const audible: HomeAudible = {
      id: roundup.id,
      title: roundup.title,
      summary: roundup.summary,
      duration: roundup.duration,
      coverImage: roundup.coverImage || null,
      audioUrl: roundup.audioUrl,
      sectionId: "monthly-roundup"
    };
    
    onClick(audible);
  };

  return (
    <Card className="min-w-[280px] max-w-[280px] h-[200px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="h-24 w-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center"
          style={{
            backgroundImage: roundup.coverImage ? `url(${roundup.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!roundup.coverImage && (
            <span className="text-white font-bold text-xl">Monthly Roundup</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{roundup.date}</div>
          <h3 className="text-sm font-medium mb-1 line-clamp-1">{roundup.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{roundup.summary}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formatDuration(roundup.duration)}</span>
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

interface MonthlyRoundupCarouselProps {
  playAudible: (audible: HomeAudible) => void;
}

export default function MonthlyRoundupCarousel({ playAudible }: MonthlyRoundupCarouselProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Monthly Round-Up</h2>
      <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {monthlyRoundupData.map((roundup) => (
          <MonthlyRoundupCard key={roundup.id} roundup={roundup} onClick={playAudible} />
        ))}
      </div>
    </div>
  );
}