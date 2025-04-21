import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./components/AuthProvider";

import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import LearnPage from "@/pages/LearnPage";
import AudioPlayerPage from "@/pages/AudioPlayerPage";
import AudiblePlayPage from "@/pages/AudiblePlayPage";
import RevisePage from "@/pages/RevisePage";
import TriviaPage from "@/pages/TriviaPage";
import ProgressPage from "@/pages/ProgressPage";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import BottomNavigation from "./components/BottomNavigation";
import MiniPlayer from "./components/MiniPlayer";
import Header from "./components/layout/Header";
import { useState } from "react";
import { Audible } from "./types";

export interface AudioPlayerState {
  audible: Audible | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

function Router() {
  const { user } = useAuth();
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    audible: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const playAudible = (audible: Audible) => {
    setAudioState({
      audible,
      isPlaying: true,
      currentTime: 0,
      duration: audible.duration || 0
    });
  };

  const togglePlayPause = () => {
    setAudioState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const updateTime = (time: number) => {
    setAudioState(prev => ({
      ...prev,
      currentTime: time
    }));
  };

  // For now, we'll skip authentication check to allow easier testing
  // if (!user) {
  //   return (
  //     <Switch>
  //       <Route path="/" component={LoginPage} />
  //       <Route path="/register" component={RegisterPage} />
  //       <Route path="/auth" component={LoginPage} />
  //       <Route component={LoginPage} />
  //     </Switch>
  //   );
  // }

  return (
    <div className="pb-16 min-h-screen">
      <Header />
      
      <main className="mt-2">
        <Switch>
          <Route path="/" component={() => <HomePage playAudible={playAudible} />} />
          <Route path="/learn" component={() => <LearnPage playAudible={playAudible} />} />
          <Route path="/player" component={() => 
            <AudioPlayerPage 
              audioState={audioState} 
              togglePlayPause={togglePlayPause} 
              updateTime={updateTime}
            />
          } />
          <Route path="/play/:audibleId" component={() => 
            <AudiblePlayPage 
              audioState={audioState} 
              togglePlayPause={togglePlayPause} 
              updateTime={updateTime}
            />
          } />
          <Route path="/revise" component={RevisePage} />
          {/* New version of revise will be activated later */}
          {/* <Route path="/revise-new" component={RevisePage} /> */}
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/progress" component={ProgressPage} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/auth" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {audioState.audible && (
        <MiniPlayer 
          audioState={audioState} 
          togglePlayPause={togglePlayPause}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
