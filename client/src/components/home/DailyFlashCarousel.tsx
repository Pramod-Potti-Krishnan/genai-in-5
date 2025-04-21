import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { dailyFlashData } from "@/lib/leaderboard-data";
import { formatDuration } from "@/lib/utils";
import { Audible } from "@shared/schema";

interface DailyFlashCardProps {
  flash: typeof dailyFlashData[0];
  onClick: (audible: Audible) => void;
}

const DailyFlashCard = ({ flash, onClick }: DailyFlashCardProps) => {
  const handleClick = () => {
    // Convert the flash to an Audible for the audio player
    const audible: Audible = {
      id: flash.id.toString(),
      title: flash.title,
      summary: flash.summary,
      duration: flash.duration,
      coverImage: flash.coverImage,
      audioUrl: flash.audioUrl,
      sectionId: "daily-flash"
    };
    
    onClick(audible);
  };

  return (
    <Card className="min-w-[220px] max-w-[220px] h-[160px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="h-16 w-full bg-gradient-to-r from-red-600 to-red-400 flex items-center justify-center"
          style={{
            backgroundImage: flash.coverImage ? `url(${flash.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!flash.coverImage && (
            <span className="text-white font-bold text-lg">Daily Flash</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{flash.date}</div>
          <h3 className="text-sm font-medium mb-1 line-clamp-1">{flash.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{flash.summary}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formatDuration(flash.duration)}</span>
            <Button 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={handleClick}
            >
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DailyFlashCarouselProps {
  playAudible: (audible: Audible) => void;
}

export default function DailyFlashCarousel({ playAudible }: DailyFlashCarouselProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Daily Flash-Five</h2>
      <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {dailyFlashData.map((flash) => (
          <DailyFlashCard key={flash.id} flash={flash} onClick={playAudible} />
        ))}
      </div>
    </div>
  );
}