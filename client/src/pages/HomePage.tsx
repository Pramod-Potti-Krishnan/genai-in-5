import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { audibles } from "../lib/mockData";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Audible } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../components/AuthProvider";
import LeaderboardCard from "@/components/home/LeaderboardCard";
import WeeklyPulseCarousel from "@/components/home/WeeklyPulseCarousel";
import DailyFlashCarousel from "@/components/home/DailyFlashCarousel";
import MonthlyRoundupCarousel from "@/components/home/MonthlyRoundupCarousel";
import RecentUpdatesCarousel from "@/components/home/RecentUpdatesCarousel";
import TrendingTopicsCarousel from "@/components/home/TrendingTopicsCarousel";
import GreetingBanner from "@/components/home/GreetingBanner";
import { ProgressRing } from "@/components/ui/progress-ring";
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
  
  // Popular trending topics
  const trendingTopics = [
    "GenAI Basics", "LLM Architecture", "Prompt Engineering", 
    "AI in Business", "Healthcare AI", "AI Ethics", 
    "Multimodal Models", "Fine-tuning", "Embeddings", 
    "RAG Systems", "AI Agents"
  ];
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
      </header>
      
      <main className="p-4 space-y-6">
        {/* Personal Greeting */}
        <GreetingBanner userName="Pramod" />
        
        {/* Global Leaderboard - First in the order */}
        <LeaderboardCard />
        
        {/* Next Up Card - Second in the order */}
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
                  <img 
                    src={nextAudible.coverImage || "https://via.placeholder.com/200"}
                    alt={nextAudible.title}
                    className="h-full w-full object-cover rotating-img"
                  />
                  {/* Overlay progress circle */}
                  <div className="absolute bottom-2 right-2">
                    <ProgressRing 
                      percent={40} 
                      size={36} 
                      strokeWidth={3}
                      progressColor="var(--primary)" 
                      bgColor="rgba(255,255,255,0.5)"
                    />
                  </div>
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
        
        {/* Weekly Pulse - Third in the order */}
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
        
        {/* Monthly Round-Up - Fourth in the order */}
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
        
        {/* Trending Topics - Fifth in the order */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            <span className="inline-flex items-center">
              <span className="icon mr-2">🔥</span>
              Trending Topics
            </span>
          </h2>
          <TrendingTopicsCarousel playAudible={handlePlayHomeAudible} />
        </section>
        
        {/* Progress Summary - with ring instead of bar */}
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
                  {userProgress.completedAudibles.length} of {audibles.length} audibles completed
                </div>
              </div>
              <div className="flex-shrink-0">
                <ProgressRing 
                  percent={getTotalProgress()} 
                  size={80} 
                  strokeWidth={8}
                  label={<span className="text-lg font-bold">{getTotalProgress()}%</span>}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
