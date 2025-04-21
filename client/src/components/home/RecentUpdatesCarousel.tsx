import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { recentUpdatesData } from "@/lib/leaderboard-data";
import { formatDuration } from "@/lib/utils";
import { HomeAudible } from "./types";

interface RecentUpdateCardProps {
  update: typeof recentUpdatesData[0];
  onClick: (audible: HomeAudible) => void;
}

const RecentUpdateCard = ({ update, onClick }: RecentUpdateCardProps) => {
  const handleClick = () => {
    // Convert the update to an Audible for the audio player
    const audible: HomeAudible = {
      id: update.id,
      title: update.title,
      summary: update.summary,
      duration: update.duration,
      coverImage: update.coverImage || null,
      audioUrl: update.audioUrl,
      sectionId: "recent-updates"
    };
    
    onClick(audible);
  };

  return (
    <Card className="min-w-[240px] max-w-[240px] h-[180px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="h-20 w-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center"
          style={{
            backgroundImage: update.coverImage ? `url(${update.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!update.coverImage && (
            <span className="text-white font-bold text-lg">Recent Update</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{update.date}</div>
          <h3 className="text-sm font-medium mb-1 line-clamp-1">{update.title}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{update.summary}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formatDuration(update.duration)}</span>
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

interface RecentUpdatesCarouselProps {
  playAudible: (audible: HomeAudible) => void;
}

export default function RecentUpdatesCarousel({ playAudible }: RecentUpdatesCarouselProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Trending Topics</h2>
      <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {recentUpdatesData.map((update) => (
          <RecentUpdateCard key={update.id} update={update} onClick={playAudible} />
        ))}
      </div>
    </div>
  );
}