import { useLocation } from "wouter";
import { AudioPlayerState } from "../App";

interface MiniPlayerProps {
  audioState: AudioPlayerState;
  togglePlayPause: () => void;
}

export default function MiniPlayer({ audioState, togglePlayPause }: MiniPlayerProps) {
  const [, navigate] = useLocation();
  const { audible, isPlaying, currentTime, duration } = audioState;

  if (!audible) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const navigateToPlayer = () => {
    navigate("/player");
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-md p-2 z-10">
      <div className="flex items-center" onClick={navigateToPlayer}>
        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
          <img 
            src={audible.coverImage || "https://via.placeholder.com/40"} 
            alt="Now playing thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 mr-3 truncate">
          <div className="font-medium text-gray-900 text-sm truncate">{audible.title}</div>
          <div className="text-xs text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <button 
          className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
        </button>
      </div>
    </div>
  );
}
