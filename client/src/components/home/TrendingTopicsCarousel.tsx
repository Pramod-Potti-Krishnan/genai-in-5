import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { HomeAudible } from "./types";

// Define trending topics data with audio content
export const trendingTopicsData = [
  {
    id: "topic-1",
    title: "Machine Learning",
    summary: "Learn about the fundamentals of machine learning and AI algorithms.",
    date: "Trending Now",
    audioUrl: "https://example.com/audio/machine-learning-intro.mp3",
    duration: 480, // 8 minutes
    coverImage: null,
    gradient: "from-purple-600 to-purple-400"
  },
  {
    id: "topic-2",
    title: "Blockchain Technology",
    summary: "Discover how blockchain is changing finance and digital ownership.",
    date: "Hot Topic",
    audioUrl: "https://example.com/audio/blockchain-basics.mp3",
    duration: 560, // 9:20 minutes
    coverImage: null,
    gradient: "from-blue-600 to-blue-400"
  },
  {
    id: "topic-3",
    title: "Remote Work",
    summary: "Tips and strategies for effective remote collaboration and productivity.",
    date: "Rising Trend",
    audioUrl: "https://example.com/audio/remote-work-tips.mp3",
    duration: 420, // 7 minutes
    coverImage: null,
    gradient: "from-green-600 to-green-400"
  },
  {
    id: "topic-4",
    title: "Sustainability",
    summary: "How businesses are adapting to create more sustainable operations.",
    date: "Growing Interest",
    audioUrl: "https://example.com/audio/sustainability-intro.mp3",
    duration: 390, // 6:30 minutes
    coverImage: null,
    gradient: "from-amber-600 to-amber-400"
  },
  {
    id: "topic-5",
    title: "Digital Privacy",
    summary: "Understanding digital privacy and protecting your personal data online.",
    date: "Critical Issue",
    audioUrl: "https://example.com/audio/digital-privacy.mp3",
    duration: 495, // 8:15 minutes
    coverImage: null,
    gradient: "from-red-600 to-red-400"
  }
];

interface TopicCardProps {
  topic: typeof trendingTopicsData[0];
  onClick: (audible: HomeAudible) => void;
}

const TopicCard = ({ topic, onClick }: TopicCardProps) => {
  const handleClick = () => {
    // Convert the topic to a HomeAudible for the audio player
    const audible: HomeAudible = {
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      duration: topic.duration,
      coverImage: topic.coverImage || null,
      audioUrl: topic.audioUrl,
      sectionId: "trending-topics"
    };
    
    onClick(audible);
  };

  return (
    <Card className="min-w-[280px] max-w-[280px] h-[180px] snap-center mr-4 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className={`h-20 w-full bg-gradient-to-r ${topic.gradient} flex items-center justify-center`}
          style={{
            backgroundImage: topic.coverImage ? `url(${topic.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!topic.coverImage && (
            <span className="text-white font-bold text-lg">{topic.title}</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1">{topic.date}</div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{topic.summary}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formatDuration(topic.duration)}</span>
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

interface TrendingTopicsCarouselProps {
  playAudible: (audible: HomeAudible) => void;
}

export default function TrendingTopicsCarousel({ playAudible }: TrendingTopicsCarouselProps) {
  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {trendingTopicsData.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onClick={playAudible} />
        ))}
      </div>
    </div>
  );
}