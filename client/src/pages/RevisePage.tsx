import { useState, useEffect } from "react";
import { flashcards, audibles } from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../components/AuthProvider";

export default function RevisePage() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [availableCards, setAvailableCards] = useState(flashcards);
  
  useEffect(() => {
    // Filter cards for completed audibles
    const completedAudibleIds = userProgress.completedAudibles;
    const cards = flashcards.filter(card => completedAudibleIds.includes(card.audibleId));
    
    setAvailableCards(cards);
  }, [userProgress]);
  
  const toggleCardReviewed = (flashcardId: number) => {
    setUserProgress(prev => {
      // Check if the card is already reviewed
      if (prev.reviewedFlashcards.includes(flashcardId)) {
        // Remove from reviewed
        return {
          ...prev,
          reviewedFlashcards: prev.reviewedFlashcards.filter(id => id !== flashcardId)
        };
      } else {
        // Add to reviewed
        return {
          ...prev,
          reviewedFlashcards: [...prev.reviewedFlashcards, flashcardId]
        };
      }
    });
  };
  
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && currentCardIndex < availableCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (direction === "right" && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  const getAudibleTitle = (audibleId: number) => {
    return audibles.find(a => a.id === audibleId)?.title || "Unknown Audible";
  };
  
  if (!user) return null;
  
  if (availableCards.length === 0) {
    return (
      <div className="flex-1 pb-16">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Revise</h1>
        </header>
        
        <main className="p-4 flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center p-6">
            <div className="text-4xl mb-4 text-gray-400">
              <i className="fas fa-book-open"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Cards to Revise</h2>
            <p className="text-gray-600 mb-4">Complete some audibles in the Learn section to start revising with flashcards.</p>
            <Button onClick={() => window.location.href = "/learn"}>
              Go to Learn
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const currentCard = availableCards[currentCardIndex];
  const isReviewed = userProgress.reviewedFlashcards.includes(currentCard.id);
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Revise</h1>
      </header>
      
      <main className="p-4">
        <div className="relative h-[350px]">
          <AnimatePresence>
            <motion.div
              key={currentCard.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  handleSwipe("right");
                } else if (info.offset.x < -100) {
                  handleSwipe("left");
                }
              }}
              className="absolute inset-0"
            >
              <Card className="h-full">
                <CardContent className="p-5 h-full flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {getAudibleTitle(currentCard.audibleId)}
                  </h2>
                  
                  <ul className="space-y-3 flex-1">
                    {currentCard.points.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <i className="fas fa-circle text-xs text-primary mt-1.5 mr-3"></i>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {currentCardIndex + 1} of {availableCards.length} cards
                    </span>
                    <Button
                      variant={isReviewed ? "default" : "outline"}
                      className={`flex items-center ${isReviewed ? 'bg-primary text-white' : 'text-gray-700'}`}
                      onClick={() => toggleCardReviewed(currentCard.id)}
                    >
                      <i className={`${isReviewed ? 'fas' : 'far'} fa-check mr-2`}></i>
                      Mark Reviewed
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    Swipe left or right to navigate
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
