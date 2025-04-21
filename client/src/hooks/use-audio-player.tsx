import { useState, useRef, useEffect, useCallback } from 'react';
import { Audible } from '@/types';
import { saveAudioPosition, getAudioPosition } from '@/utils/local-storage';

interface AudioPlayerHook {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  loading: boolean;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  formattedCurrentTime: string;
  formattedDuration: string;
  playbackRate: number;
}

export function useAudioPlayer(audible: Audible | null): AudioPlayerHook {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Load audio when audible changes
  useEffect(() => {
    if (audible && audioRef.current) {
      setLoading(true);
      
      // Reset state
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      // Set audio source
      audioRef.current.src = audible.audioUrl;
      
      // Load saved position if available
      const savedPosition = getAudioPosition(audible.id);
      if (savedPosition > 0) {
        audioRef.current.currentTime = savedPosition;
        setCurrentTime(savedPosition);
      }
      
      // Load audio
      audioRef.current.load();
    }
  }, [audible]);

  // Setup event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audible) {
        saveAudioPosition(audible.id, audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleLoadedData = () => {
      setLoading(false);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audible]);

  // Play function
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Error playing audio:", error));
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek function
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (audible) {
        saveAudioPosition(audible.id, time);
      }
    }
  }, [audible]);

  // Set playback rate
  const setPlaybackRateValue = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
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
    setPlaybackRate: setPlaybackRateValue,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    playbackRate
  };
}
