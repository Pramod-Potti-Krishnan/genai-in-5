import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TourContextType {
  showTour: boolean;
  startTour: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [showTour, setShowTour] = useState(false);

  const startTour = () => {
    console.log('Starting tour...');
    setShowTour(true);
  };

  const endTour = () => {
    setShowTour(false);
  };

  return (
    <TourContext.Provider value={{ showTour, startTour, endTour }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}