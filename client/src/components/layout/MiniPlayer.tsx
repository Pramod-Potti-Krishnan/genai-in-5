import { Play, Pause, Volume2 } from "lucide-react";
import { useAppContext } from "@/app-context";
import { useLocation } from "wouter";

export default function MiniPlayer() {
  const { currentAudible, isPlaying, miniPlayerVisible, togglePlayPause } = useAppContext();
  const [location, setLocation] = useLocation();
  
  // Don't show mini player when we're on the audio player page or when there's no current audible
  const isAudioPlayerPage = location.startsWith('/audio/');
  if (isAudioPlayerPage || !miniPlayerVisible || !currentAudible) {
    return null;
  }
  
  // Calculate display time
  const displayTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Navigate to the audio player page
  const goToAudioPlayer = () => {
    setLocation(`/audio/${currentAudible.id}`);
  };

  return (
    <div className="fixed left-0 right-0 bottom-14 bg-white border-t border-gray-200 px-4 py-2 shadow-md z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1" onClick={goToAudioPlayer}>
          <div className="bg-primary-100 rounded-full p-2 mr-3">
            <Volume2 className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
              {currentAudible.title}
            </p>
            <p className="text-xs text-gray-600">
              {displayTime(3 * 60 + 45)} / {displayTime(Math.floor(currentAudible.duration))}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="text-primary-500 hover:text-primary-600"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
