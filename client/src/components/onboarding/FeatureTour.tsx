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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
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

  // Update window size only on mount
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initialize on mount
    updateWindowSize();
    
    // Update on resize
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);
  
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

  // Calculate tooltip position to keep it on screen
  const tooltipWidth = Math.min(windowSize.width - 32, 360); // Max width with padding
  const tooltipLeft = Math.max(
    16, // Left padding
    Math.min(
      position.left - (tooltipWidth / 2) + (position.width / 2),
      windowSize.width - tooltipWidth - 16 // Keep right edge in bounds
    )
  );
  
  // Calculate tooltip top position to keep it on screen
  const tooltipTop = position.top < 150 
    ? position.top + 70 // If tab is at the top of screen, show tooltip below
    : position.top - 150; // Otherwise show above
  
  // Determine if arrow should be at top or bottom
  const arrowAtBottom = position.top >= 150;

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
        className="absolute z-[10002] bg-card p-5 rounded-lg shadow-lg w-full"
        style={{
          top: `${tooltipTop}px`,
          left: '16px',
          width: `calc(100% - 32px)`,
          maxWidth: '400px',
          transform: `translateX(calc(50% - ${tooltipWidth/2}px))`,
        }}
      >
        <div className="text-foreground mb-5 text-base">
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
          style={arrowAtBottom ? {
            bottom: '-8px',
            left: `calc(${position.left + position.width/2}px - ${tooltipLeft}px)`,
            transform: 'translateX(-50%)',
          } : {
            top: '-8px',
            left: `calc(${position.left + position.width/2}px - ${tooltipLeft}px)`,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  );
}