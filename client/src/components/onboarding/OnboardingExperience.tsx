import { useState, useEffect } from 'react';
import IntroCarousel from './IntroCarousel';
import FeatureTour from './FeatureTour';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTour } from './TourContext';

interface OnboardingExperienceProps {
  userId: number;
  showOnboarding: boolean;
}

export default function OnboardingExperience({ userId, showOnboarding }: OnboardingExperienceProps) {
  const [showIntro, setShowIntro] = useState(showOnboarding);
  const { showTour, startTour, endTour } = useTour();
  const { toast } = useToast();
  
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/me/complete-onboarding`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Onboarding completed",
        description: "You're all set to start learning!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleIntroComplete = () => {
    setShowIntro(false);
    startTour(); // Start the feature tour after intro
  };
  
  const handleIntroSkip = () => {
    setShowIntro(false);
    completeOnboardingMutation.mutate();
  };
  
  const handleTourComplete = () => {
    endTour();
    completeOnboardingMutation.mutate();
  };
  
  if (!showOnboarding) {
    return null;
  }
  
  return (
    <>
      {showIntro && (
        <IntroCarousel 
          onComplete={handleIntroComplete} 
          onSkip={handleIntroSkip} 
        />
      )}
      
      {showTour && (
        <FeatureTour 
          onComplete={handleTourComplete} 
          active={showTour} 
        />
      )}
    </>
  );
}