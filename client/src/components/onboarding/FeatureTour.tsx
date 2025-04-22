import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface FeatureTourProps {
  onComplete: () => void;
  active: boolean;
}

interface TourStep {
  target: string;
  content: string;
}

// Custom tour component that doesn't rely on react-joyride
export default function FeatureTour({ onComplete, active }: FeatureTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Define the content for each tab
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="home-tab"]',
      content: 'This is your Home tab. Start your learning journey here with personalized recommendations.',
    },
    {
      target: '[data-tour="learn-tab"]',
      content: 'Browse all available topics organized by category in the Learn tab.',
    },
    {
      target: '[data-tour="revise-tab"]',
      content: 'Use the Revise tab to practice with flashcards and reinforce what you\'ve learned.',
    },
    {
      target: '[data-tour="trivia-tab"]',
      content: 'Test your knowledge with quick quizzes in the Trivia tab.',
    },
    {
      target: '[data-tour="progress-tab"]',
      content: 'Track your learning journey and achievements in the Progress tab.',
    },
  ];

  // Update position based on current step
  useEffect(() => {
    if (!showTour) return;
    
    const updatePosition = () => {
      const targetElement = document.querySelector(tourSteps[currentStep].target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width
        });
      }
    };
    
    // Update position immediately and when window resizes
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, showTour, tourSteps]);
  
  // Start the tour when active
  useEffect(() => {
    if (active) {
      // Short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [active]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // Handle skip or completion
  const handleComplete = () => {
    setShowTour(false);
    onComplete();
  };

  if (!showTour) {
    return null;
  }

  const currentTourStep = tourSteps[currentStep];

  // Build a simple custom tooltip
  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center pointer-events-auto">
      {/* Highlight the current tab */}
      <div 
        className="absolute border-2 border-primary rounded-md z-[10001] animate-pulse"
        style={{
          top: `${position.top - 5}px`,
          left: `${position.left - 5}px`,
          width: `${position.width + 10}px`,
          height: '60px',
        }}
      />
      
      {/* Tooltip */}
      <div 
        className="absolute z-[10002] bg-card p-4 rounded-lg shadow-lg max-w-xs"
        style={{
          top: `${position.top - 130}px`,
          left: `${position.left - 50}px`, 
        }}
      >
        <div className="text-foreground mb-4">
          {currentTourStep.content}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            onClick={handleComplete}
            className="text-muted-foreground px-5 py-2 text-sm font-medium cursor-pointer hover:bg-muted"
          >
            Skip
          </Button>
          
          <div className="text-xs text-muted-foreground">
            {currentStep + 1}/{tourSteps.length}
          </div>
          
          <Button 
            onClick={handleNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 text-sm font-medium cursor-pointer"
            type="button"
          >
            {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </div>
        
        {/* Arrow pointing to the target */}
        <div 
          className="absolute w-4 h-4 bg-card rotate-45"
          style={{
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  );
}