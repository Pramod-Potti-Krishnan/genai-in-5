import { useState, useEffect } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { audibles } from "../lib/mockData";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Audible } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../components/AuthProvider";
import LeaderboardCard from "@/components/home/LeaderboardCard";
import WeeklyPulseCarousel from "@/components/home/WeeklyPulseCarousel";
import DailyFlashCarousel from "@/components/home/DailyFlashCarousel";
import MonthlyRoundupCarousel from "@/components/home/MonthlyRoundupCarousel";
import RecentUpdatesCarousel from "@/components/home/RecentUpdatesCarousel";
import { HomeAudible } from "@/components/home/types";

interface HomePageProps {
  playAudible: (audible: Audible) => void;
}

export default function HomePage({ playAudible }: HomePageProps) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [nextAudible, setNextAudible] = useState<Audible | null>(null);
  const [recentAudibles, setRecentAudibles] = useState<Audible[]>([]);
  
  useEffect(() => {
    // Find next audible (first incomplete)
    const nextUp = audibles.find(audible => 
      !userProgress.completedAudibles.includes(audible.id)
    ) || audibles[0];
    
    setNextAudible(nextUp);
    
    // Get recent audibles (just show the last 4 for now)
    const recent = [...audibles]
      .sort((a, b) => b.id - a.id) // Sort by newest first (using id as proxy)
      .slice(0, 4);
    
    setRecentAudibles(recent);
  }, [userProgress]);
  
  const getTotalProgress = () => {
    const totalAudibles = audibles.length;
    const completedCount = userProgress.completedAudibles.length;
    return Math.round((completedCount / totalAudibles) * 100);
  };
  
  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)} min`;
  };
  
  if (!user) return null;
  
  // Handler for playing home audibles
  const handlePlayHomeAudible = (homeAudible: HomeAudible) => {
    // Convert HomeAudible to Audible for compatibility with existing player
    const audibleToPlay: Audible = {
      id: parseInt(homeAudible.id),
      title: homeAudible.title,
      description: homeAudible.summary,
      audioUrl: homeAudible.audioUrl,
      coverImage: homeAudible.coverImage || null,
      durationInSeconds: homeAudible.duration,
      sectionId: 1, // Default section
      createdAt: new Date()
    };
    
    playAudible(audibleToPlay);
  };
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
      </header>
      
      <main className="p-4 space-y-6">
        {/* Next Up Card - First in the order */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">Next Up</h2>
          {nextAudible && (
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3 bg-gray-100">
                  <img 
                    src={nextAudible.coverImage || "https://via.placeholder.com/200"}
                    alt={nextAudible.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{nextAudible.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDuration(nextAudible.durationInSeconds)} · 
                      {audibles.find(a => a.id === nextAudible.sectionId)?.title || 'General'}
                    </p>
                  </div>
                  <button
                    className="bg-primary text-white rounded-full py-2 px-6 inline-flex items-center justify-center text-sm font-medium"
                    onClick={() => playAudible(nextAudible)}
                  >
                    <i className="fas fa-play mr-2"></i> Play
                  </button>
                </div>
              </div>
            </Card>
          )}
        </section>
        
        {/* Global Leaderboard - Second in the order */}
        <LeaderboardCard />
        
        {/* Weekly Pulse - Third in the order */}
        <WeeklyPulseCarousel playAudible={handlePlayHomeAudible} />
        
        {/* Monthly Round-Up - Fourth in the order (New) */}
        <MonthlyRoundupCarousel playAudible={handlePlayHomeAudible} />
        
        {/* Recent Updates - Fifth in the order (New) */}
        <RecentUpdatesCarousel playAudible={handlePlayHomeAudible} />
        
        {/* Progress Summary - Optional */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">Progress Summary</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                <span className="text-sm font-medium text-gray-900">{getTotalProgress()}%</span>
              </div>
              <Progress value={getTotalProgress()} className="h-2" />
              <div className="mt-3 text-xs text-gray-500">
                {userProgress.completedAudibles.length} of {audibles.length} audibles completed
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
