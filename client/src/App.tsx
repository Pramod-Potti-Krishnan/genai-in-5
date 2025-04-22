import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { AppProvider } from "./app-context";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import { OnboardingExperience } from "@/components/onboarding";

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
import AdminDashboard from "./pages/admin/AdminDashboard";
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
  const { user, showOnboarding } = useAuth();
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    audible: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const playAudible = (audible: any) => {
    // Normalize different audible schemas into a common format
    // This handles both client types and server schema types
    const enhancedAudible: any = {
      ...audible,
      // Handle lengthSec (from DB) or durationInSeconds/duration (from client)
      duration: audible.duration || audible.durationInSeconds || audible.lengthSec || 0,
      // Handle summary/description differences
      summary: audible.summary || audible.description || '',
      // Ensure required fields have default values
      sectionId: audible.sectionId || audible.topicId || 0,
      description: audible.description || audible.summary || '',
    };
    
    setAudioState({
      audible: enhancedAudible,
      isPlaying: true,
      currentTime: 0,
      duration: enhancedAudible.duration || enhancedAudible.durationInSeconds || enhancedAudible.lengthSec || 0
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
          <Route path="/trivia" component={TriviaPage} />
          <Route path="/progress" component={ProgressPage} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/auth" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/admin">
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </Route>
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
      
      {user && (
        <OnboardingExperience 
          userId={user.id} 
          showOnboarding={showOnboarding} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <AppProvider>
            <Router />
          </AppProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
