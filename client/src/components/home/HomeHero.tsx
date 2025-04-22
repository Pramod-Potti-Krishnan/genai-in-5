import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Audible, Topic, UserProgress } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface HomeHeroProps {
  playAudible: (audible: Audible) => void;
  nextAudible: Audible | null;
  topics?: Topic[];
}

export default function HomeHero({ playAudible, nextAudible, topics }: HomeHeroProps) {
  // Get navigation function from wouter
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  
  const [isFirstSession, setIsFirstSession] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Fetch whether user has started learning
  const { data } = useQuery<{ hasStartedLearning: boolean }>({
    queryKey: ['/api/me/has-started-learning'],
    // Return null on 401 to handle unauthenticated users gracefully
    enabled: true, // Always fetch, even for guest users
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    if (data !== undefined) {
      setIsFirstSession(!data.hasStartedLearning);
    }
  }, [data]);
  
  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)} min`;
  };
  
  // Navigate to learn page
  const handleChooseTopics = () => {
    navigate('/learn');
  };
  
  // Navigate to onboarding
  const handleTakeTour = () => {
    // Optionally trigger onboarding carousel here
    console.log('Taking tour...');
    // Implement your onboarding trigger logic
  };
  
  // If we're still determining user's learning status
  if (isFirstSession === null) {
    return (
      <div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }
  
  return (
    <div 
      className={`transition-all duration-250 ease-in-out ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ 
        height: isFirstSession ? 'min(45vh, 400px)' : 'min(30vh, 240px)',
      }}
    >
      {isFirstSession ? (
        // "Start Learning" Mode
        <Card className="w-full h-full overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 z-0" />
          
          {/* Content */}
          <CardContent className="h-full flex relative z-10 p-6">
            {/* Brain image in a way that doesn't interfere with text */}
            <div className="w-1/3 relative flex items-center justify-center hidden md:flex">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
                <div className="text-8xl">🧠</div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col justify-center z-10">
              <h3 className="text-2xl font-bold mb-3">
                Begin Your GenAI Journey
              </h3>
              <p className="text-muted-foreground mb-6">
                Pick your first topic and start learning with bite-sized audio lessons designed for busy professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleChooseTopics}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                  size="lg"
                >
                  <BookOpen className="h-4 w-4" />
                  Choose Topics
                </Button>
                
                <Button 
                  variant="link" 
                  onClick={handleTakeTour}
                  className="text-muted-foreground hover:text-primary"
                >
                  Take a quick tour again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // "Next Up" Mode - More prominent than the current tiny card
        nextAudible && (
          <Card className="w-full h-full overflow-hidden">
            <div className="flex h-full">
              <div className="w-1/3 bg-gray-100 relative" style={{ minHeight: '180px' }}>
                {nextAudible.coverImage ? (
                  <img 
                    src={nextAudible.coverImage}
                    alt={nextAudible.title}
                    className="h-full w-full object-cover absolute inset-0"
                  />
                ) : (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary-100 to-primary-50"
                  >
                    <span className="text-6xl">🎧</span>
                  </div>
                )}
              </div>
              
              <div className="w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{nextAudible.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDuration(nextAudible.lengthSec)} · 
                    {topics?.find(t => t.id === nextAudible.topicId)?.title || 'General'}
                  </p>
                  <p className="mt-3 text-gray-700 line-clamp-2">
                    {nextAudible.summary}
                  </p>
                </div>
                
                <Button
                  onClick={() => playAudible(nextAudible)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 mt-4"
                  size="lg"
                >
                  <PlayCircle className="h-5 w-5" /> 
                  Play Now
                </Button>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  );
}