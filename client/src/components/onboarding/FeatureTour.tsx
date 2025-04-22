import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, StoreHelpers } from 'react-joyride';

interface FeatureTourProps {
  onComplete: () => void;
  active: boolean;
}

export default function FeatureTour({ onComplete, active }: FeatureTourProps) {
  const [helpers, setHelpers] = useState<StoreHelpers | null>(null);
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Define the tour steps
  const steps = [
    {
      target: '[data-tour="home-tab"]',
      content: 'This is your Home tab. Start your learning journey here with personalized recommendations.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tour="learn-tab"]',
      content: 'Browse all available topics organized by category in the Learn tab.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="revise-tab"]',
      content: 'Use the Revise tab to practice with flashcards and reinforce what you've learned.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="trivia-tab"]',
      content: 'Test your knowledge with quick quizzes in the Trivia tab.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="progress-tab"]',
      content: 'Track your learning journey and achievements in the Progress tab.',
      placement: 'bottom',
    },
  ];

  useEffect(() => {
    if (active) {
      // Short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [active]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    setStepIndex(index);
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      onComplete();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      stepIndex={stepIndex}
      styles={{
        options: {
          arrowColor: 'hsl(var(--card))',
          backgroundColor: 'hsl(var(--card))',
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltip: {
          borderRadius: 'var(--radius)',
          fontSize: '16px',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 'var(--radius)',
          color: 'hsl(var(--primary-foreground))',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: 10,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      disableCloseOnEsc
      getHelpers={setHelpers}
    />
  );
}