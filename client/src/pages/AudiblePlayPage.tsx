import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { getAudibleById } from "@/lib/mock-data";
import { AudioPlayerState } from "../App";
import { ChevronLeft, SkipBack, Play, Pause, SkipForward, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "../lib/useLocalStorage";

interface AudiblePlayPageProps {
  audioState: AudioPlayerState;
  togglePlayPause: () => void;
  updateTime: (time: number) => void;
}

export default function AudiblePlayPage({ 
  audioState, 
  togglePlayPause, 
  updateTime 
}: AudiblePlayPageProps) {
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ audibleId: string }>("/play/:audibleId");
  const { toast } = useToast();
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [savedPositions, setSavedPositions] = useLocalStorage<Record<string, number>>("savedAudioPositions", {});
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { audible, isPlaying, currentTime } = audioState;
  
  // This effect is responsible for fetching the audible when the route changes
  useEffect(() => {
    if (!params) return;
    
    const { audibleId } = params;
    const fetchedAudible = getAudibleById(audibleId);
    
    if (!fetchedAudible) {
      toast({
        title: "Audio not found",
        description: "The requested audio could not be found.",
        variant: "destructive"
      });
      navigate("/learn");
      return;
    }
  }, [params, toast, navigate]);
  
  // This effect manages the audio element behavior
  useEffect(() => {
    if (!audible || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Failed to play:", err);
        toast({
          title: "Playback Error",
          description: "There was an error playing this audio. Please try again.",
          variant: "destructive"
        });
      });
    } else {
      audioRef.current.pause();
    }
    
    // Set the playback rate
    audioRef.current.playbackRate = playbackRate;
    
    // Save position periodically
    const savePositionInterval = setInterval(() => {
      if (audioRef.current && audible) {
        setSavedPositions(prev => ({
          ...prev,
          [audible.id]: audioRef.current!.currentTime
        }));
      }
    }, 5000);
    
    return () => clearInterval(savePositionInterval);
  }, [audible, isPlaying, playbackRate, setSavedPositions, toast]);
  
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
  
  // If no audible is loaded, show a placeholder
  if (!audible) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-xl font-semibold mb-2">Audio not available</h2>
        <p className="text-gray-600 mb-4">The requested audio could not be found</p>
        <Button onClick={() => navigate("/learn")}>
          Back to Learn
        </Button>
      </div>
    );
  }
  
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
    
    toast({
      title: `Speed: ${rates[nextIndex].toFixed(2)}x`,
      duration: 1500
    });
  };
  
  const markComplete = () => {
    // Save as completed in localStorage (would connect to backend in a real app)
    setSavedPositions(prev => ({
      ...prev,
      [audible.id]: audible.duration // Mark as fully listened
    }));
    
    toast({
      title: "Success",
      description: "Audible marked as complete!"
    });
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="flex-1 pb-16">
      <audio 
        ref={audioRef} 
        src={audible.audioUrl} 
        onEnded={() => updateTime(audible.duration)}
        className="hidden"
      />
      
      <header className="p-4 border-b flex items-center">
        <button 
          className="mr-3 p-2 rounded-full hover:bg-gray-100" 
          onClick={goBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 truncate">{audible.title}</h1>
      </header>
      
      <main className="p-4 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="aspect-square bg-gray-100 rounded-lg mb-6 overflow-hidden shadow-md">
            {audible.coverImage ? (
              <img 
                src={audible.coverImage}
                alt={`${audible.title} cover art`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
                <span className="text-3xl font-bold text-gray-400">{audible.title.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{audible.title}</h2>
            <p className="text-gray-600 mb-2">{audible.summary}</p>
            <Badge variant="secondary" className="flex items-center w-fit">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(audible.duration)}
            </Badge>
          </div>
          
          <div className="mb-8 w-full">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-primary h-full rounded-full transition-all" 
                style={{ width: `${(currentTime / audible.duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audible.duration)}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-8 mb-10">
            <button 
              className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={rewind10s}
              aria-label="Rewind 10 seconds"
            >
              <SkipBack className="h-6 w-6 text-gray-700" />
            </button>
            
            <button 
              className="h-16 w-16 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>
            
            <button 
              className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={forward10s}
              aria-label="Forward 10 seconds"
            >
              <SkipForward className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={rewind10s}
            >
              <SkipBack className="h-4 w-4" />
              <span>10s</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={togglePlaybackRate}
              >
                <span>{playbackRate.toFixed(2)}x</span>
              </Button>
              
              <Button 
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                size="sm"
                onClick={markComplete}  
              >
                <Check className="h-4 w-4" />
                <span>Mark Complete</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}