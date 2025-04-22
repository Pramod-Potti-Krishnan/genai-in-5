import { useState, useEffect } from "react";
import { Audible, Topic } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../components/AuthProvider";
import LeaderboardCard from "@/components/home/LeaderboardCard";
import WeeklyPulseCarousel from "@/components/home/WeeklyPulseCarousel";
import MonthlyRoundupCarousel from "@/components/home/MonthlyRoundupCarousel";
import TrendingTopicsCarousel from "@/components/home/TrendingTopicsCarousel";
import GreetingBanner from "@/components/home/GreetingBanner";
import { HomeAudible } from "@/components/home/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlayCircle } from "lucide-react";

interface HomePageProps {
  playAudible: (audible: Audible) => void;
}

export default function HomePage({ playAudible }: HomePageProps) {
  const { user } = useAuth();
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  // For development, create a test user if no user is logged in
  const testUser = { 
    id: 1, 
    name: "Test User", 
    firstName: "Test",
    lastName: "User",
    email: "test@example.com", 
    isAdmin: false
  };

  // Fetch topics from API
  const { data: topics, isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch audibles from API
  const { data: audibles, isLoading: isLoadingAudibles } = useQuery<Audible[]>({
    queryKey: ['/api/audibles'],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Loading state
  const isLoading = isLoadingTopics || isLoadingAudibles;
  
  // Initialize carousel drag-to-scroll functionality
  useEffect(() => {
    const setupCarouselSwipe = () => {
      const carousels = document.querySelectorAll('.carousel');
      
      carousels.forEach(carousel => {
        carousel.addEventListener('wheel', (e: any) => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
          e.preventDefault();
          carousel.scrollLeft += e.deltaX;
        });
      });
    };
    
    // Run after DOM is ready
    setTimeout(setupCarouselSwipe, 500);
    
    return () => {
      const carousels = document.querySelectorAll('.carousel');
      carousels.forEach(carousel => {
        carousel.removeEventListener('wheel', () => {});
      });
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex-1 pb-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Use testUser if no user is authenticated
  const activeUser = user || testUser;
  
  // Calculate next audible (first in the list for now)
  const nextAudible = audibles && audibles.length > 0 ? audibles[0] : null;
  
  // Format duration from seconds to minutes for display
  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)} min`;
  };
  
  // Calculate total progress percentage
  const getTotalProgress = () => {
    if (!audibles) return 0;
    const totalAudibles = audibles.length;
    const completedCount = completedIds.length;
    return totalAudibles > 0 ? Math.round((completedCount / totalAudibles) * 100) : 0;
  };
  
  // Handler for playing home audibles
  const handlePlayHomeAudible = (homeAudible: HomeAudible) => {
    // Find the matching audible from our database records
    if (audibles) {
      const dbAudible = audibles.find(a => a.id === parseInt(homeAudible.id.toString()));
      if (dbAudible) {
        playAudible(dbAudible);
        return;
      }
    }
    
    // Fallback if not found in database
    const audibleToPlay: Audible = {
      id: parseInt(homeAudible.id.toString()),
      title: homeAudible.title,
      summary: homeAudible.summary || "",  // Ensure it's not undefined
      audioUrl: homeAudible.audioUrl || "",  // Ensure it's not undefined
      coverImage: homeAudible.coverImage || null,
      lengthSec: homeAudible.duration || 0,  // Ensure it's not undefined
      topicId: 1,
      createdAt: null,
      updatedAt: null
    };
    
    playAudible(audibleToPlay);
  };
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
      </header>
      
      <main className="p-4 space-y-6">
        {/* Personal Greeting */}
        <GreetingBanner 
          userName={activeUser.name || "Learner"} 
          firstName={(activeUser as any).firstName}
        />
        
        {/* Global Leaderboard */}
        <LeaderboardCard />
        
        {/* Next Up Card */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">⏭️</span>
              Next Up
            </span>
          </h2>
          {nextAudible && (
            <Card className="overflow-hidden relative">
              <div className="flex">
                <div className="w-1/3 bg-gray-100 relative">
                  {nextAudible.coverImage ? (
                    <img 
                      src={nextAudible.coverImage}
                      alt={nextAudible.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                      <div className="text-4xl text-primary/80">🎧</div>
                    </div>
                  )}
                  {/* Overlay progress circle */}
                  <div className="absolute bottom-2 right-2">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white">
                        {getTotalProgress()}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{nextAudible.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDuration(nextAudible.lengthSec)} · 
                      {topics?.find(t => t.id === nextAudible.topicId)?.title || 'General'}
                    </p>
                  </div>
                  <button
                    className="bg-primary text-white rounded-full py-2 px-6 inline-flex items-center justify-center text-sm font-medium"
                    onClick={() => playAudible(nextAudible)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Play
                  </button>
                </div>
              </div>
            </Card>
          )}
        </section>
        
        {/* Weekly Pulse */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">🎧</span>
              Weekly Pulse
            </span>
          </h2>
          <div className="carousel" tabIndex={0}>
            <WeeklyPulseCarousel playAudible={handlePlayHomeAudible} />
          </div>
        </section>
        
        {/* Monthly Round-Up */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">📅</span>
              Monthly Round-Up
            </span>
          </h2>
          <div className="carousel" tabIndex={0}>
            <MonthlyRoundupCarousel playAudible={handlePlayHomeAudible} />
          </div>
        </section>
        
        {/* Trending Topics */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">🔥</span>
              Trending Topics
            </span>
          </h2>
          <TrendingTopicsCarousel playAudible={handlePlayHomeAudible} />
        </section>
        
        {/* Progress Summary */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">📊</span>
              Progress Summary
            </span>
          </h2>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                <div className="mt-3 text-xs text-gray-500">
                  {completedIds.length} of {audibles?.length || 0} audibles completed
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="text-xl font-bold text-primary">{getTotalProgress()}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
