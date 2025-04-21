import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { AudioPlayerState } from "../App";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../components/AuthProvider";

interface AudioPlayerPageProps {
  audioState: AudioPlayerState;
  togglePlayPause: () => void;
  updateTime: (time: number) => void;
}

export default function AudioPlayerPage({ 
  audioState, 
  togglePlayPause, 
  updateTime 
}: AudioPlayerPageProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { audible, isPlaying, currentTime } = audioState;
  
  useEffect(() => {
    if (!audible) {
      navigate("/learn");
      return;
    }
    
    // Set up audio element
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Failed to play:", err));
      } else {
        audioRef.current.pause();
      }
      
      audioRef.current.playbackRate = playbackRate;
    }
  }, [audible, isPlaying, playbackRate, navigate]);
  
  // Handle time updates on the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      updateTime(audio.currentTime);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [updateTime]);
  
  if (!audible || !user) return null;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const rewind10s = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      updateTime(audioRef.current.currentTime);
    }
  };
  
  const forward10s = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration, 
        audioRef.current.currentTime + 10
      );
      updateTime(audioRef.current.currentTime);
    }
  };
  
  const togglePlaybackRate = () => {
    // Cycle through common rates: 1.0, 1.25, 1.5, 1.75, 2.0
    const rates = [1.0, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };
  
  const markComplete = () => {
    setUserProgress(prev => ({
      ...prev,
      completedAudibles: [...new Set([...prev.completedAudibles, audible.id])],
      audibleProgress: {
        ...prev.audibleProgress,
        [audible.id]: 100
      }
    }));
    
    toast({
      title: "Success",
      description: "Audible marked as complete!"
    });
    
    navigate("/learn");
  };
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b flex items-center">
        <button className="mr-3" onClick={() => navigate("/learn")}>
          <i className="fas fa-arrow-left text-gray-700"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-900 truncate">{audible.title}</h1>
      </header>
      
      <main className="p-4 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="aspect-square bg-gray-100 rounded-lg mb-6 overflow-hidden">
            <img 
              src={audible.coverImage || "https://via.placeholder.com/400"}
              alt={`${audible.title} cover art`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{audible.title}</h2>
            <p className="text-gray-600">
              {audible.sectionId ? sections.find(s => s.id === audible.sectionId)?.title : 'General'} · {formatTime(audible.durationInSeconds)}
            </p>
          </div>
          
          <audio 
            ref={audioRef} 
            src={audible.audioUrl} 
            onEnded={() => updateTime(audible.durationInSeconds)}
            className="hidden"
          />
          
          <div className="mb-8 w-full">
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-primary h-full rounded-full" 
                style={{ width: `${(currentTime / audible.durationInSeconds) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audible.durationInSeconds)}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-6 mb-10">
            <button 
              className="h-12 w-12 flex items-center justify-center rounded-full"
              onClick={rewind10s}
            >
              <i className="fas fa-backward-step text-2xl text-gray-700"></i>
            </button>
            
            <button 
              className="h-16 w-16 flex items-center justify-center bg-primary text-white rounded-full shadow-lg"
              onClick={togglePlayPause}
            >
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-xl ${!isPlaying ? 'ml-1' : ''}`}></i>
            </button>
            
            <button 
              className="h-12 w-12 flex items-center justify-center rounded-full"
              onClick={forward10s}
            >
              <i className="fas fa-forward-step text-2xl text-gray-700"></i>
            </button>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={rewind10s}
            >
              <i className="fas fa-rotate-left mr-2"></i>
              <span>10s</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={togglePlaybackRate}
              >
                <i className="fas fa-gauge-high mr-2"></i>
                <span>{playbackRate.toFixed(2)}x</span>
              </Button>
              
              <Button 
                className="flex items-center bg-green-600 hover:bg-green-700"
                onClick={markComplete}  
              >
                <i className="fas fa-check mr-2"></i>
                <span>Mark Complete</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
