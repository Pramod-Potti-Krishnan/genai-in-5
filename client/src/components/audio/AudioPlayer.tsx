import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Rewind, 
  FastForward,
  Check,
  Clock
} from "lucide-react";
import { Audible } from "@/types";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/app-context";

interface AudioPlayerProps {
  audible: Audible;
  onComplete?: () => void;
  onBack?: () => void;
}

export default function AudioPlayer({ audible, onComplete, onBack }: AudioPlayerProps) {
  const { markAudibleComplete } = useAppContext();
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    progress,
    loading,
    play,
    pause,
    togglePlayPause,
    seek,
    setPlaybackRate,
    formattedCurrentTime,
    formattedDuration,
    playbackRate
  } = useAudioPlayer(audible);
  
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Handle marking as complete
  const handleMarkComplete = () => {
    markAudibleComplete(audible.id);
    setIsCompleted(true);
    if (onComplete) onComplete();
  };
  
  // Handle skipping forward/backward
  const skipForward = () => {
    seek(Math.min(currentTime + 10, duration));
  };
  
  const skipBackward = () => {
    seek(Math.max(currentTime - 10, 0));
  };
  
  // Format the duration for display (MM:SS)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <audio ref={audioRef} />
      
      <div className="mb-6 flex justify-center">
        <div className="h-48 w-48 bg-gray-200 rounded-lg flex items-center justify-center shadow">
          <Volume2 className="h-16 w-16 text-gray-400" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{audible.title}</h1>
        <p className="text-gray-600">
          {audible.sectionId.replace(/-/g, ' ')} · {formatDuration(audible.duration)}
        </p>
      </div>
      
      <div className="mb-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-primary-500">
                {formattedCurrentTime}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-500">
                {formattedDuration}
              </span>
            </div>
          </div>
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={(value) => {
              if (duration) {
                seek((value[0] / 100) * duration);
              }
            }}
            disabled={loading || duration === 0}
          />
        </div>
      </div>
      
      <div className="flex justify-center items-center space-x-6 mb-8">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => seek(0)}
          className="text-gray-600 hover:text-gray-900"
        >
          <SkipBack className="h-6 w-6" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={skipBackward}
          className="text-gray-700 hover:text-gray-900"
        >
          <Rewind className="h-6 w-6" />
        </Button>
        
        <Button
          size="lg"
          variant="primary"
          onClick={togglePlayPause}
          className="bg-primary-500 text-white rounded-full p-4 hover:bg-primary-600"
          disabled={loading}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={skipForward}
          className="text-gray-700 hover:text-gray-900"
        >
          <FastForward className="h-6 w-6" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => seek(duration)}
          className="text-gray-600 hover:text-gray-900"
        >
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-600 mr-2" />
          <Select 
            value={playbackRate.toString()} 
            onValueChange={(value) => setPlaybackRate(parseFloat(value))}
          >
            <SelectTrigger className="w-[100px] bg-gray-100 border-0 text-gray-800">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          variant={isCompleted ? "outline" : "default"}
          className={isCompleted ? "bg-gray-100 text-gray-500" : "bg-green-500 text-white hover:bg-green-600"}
        >
          <Check className="h-5 w-5 mr-1" />
          {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h2 className="font-medium text-gray-900 mb-2">About this audible</h2>
        <p className="text-sm text-gray-700">
          {audible.summary}
        </p>
      </div>
    </div>
  );
}

// Helper icons since we're not importing all of Lucide
function Volume2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
