import { useState, useEffect, useRef } from "react";
import { sections, flashcards, audibles } from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../components/AuthProvider";
import { BookOpen } from "lucide-react";
import { Flashcard } from "@shared/schema";

// Helper function to group flashcards by section
const groupFlashcardsBySection = (cards: Flashcard[]) => {
  const grouped: Record<number, Flashcard[]> = {};
  
  cards.forEach(card => {
    if (card.sectionId) {
      if (!grouped[card.sectionId]) {
        grouped[card.sectionId] = [];
      }
      grouped[card.sectionId].push(card);
    }
  });
  
  return grouped;
};

type ViewMode = 'topics' | 'cards';

export default function RevisePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [viewMode, setViewMode] = useState<ViewMode>('topics');
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [availableCards, setAvailableCards] = useState<Flashcard[]>([]);
  const [groupedCards, setGroupedCards] = useState<Record<number, Flashcard[]>>({});
  const [cardsInCurrentSection, setCardsInCurrentSection] = useState<Flashcard[]>([]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Get available flashcards and group them by section
  useEffect(() => {
    const completedAudibleIds = userProgress.completedAudibles;
    const cards = flashcards.filter(card => 
      completedAudibleIds.includes(card.audibleId)
    );
    
    setAvailableCards(cards);
    setGroupedCards(groupFlashcardsBySection(cards));
  }, [userProgress]);
  
  // When section changes, set the cards for that section
  useEffect(() => {
    if (currentSectionId && groupedCards[currentSectionId]) {
      const sectionCards = groupedCards[currentSectionId];
      
      // Sort cards: unreviewed first, then by difficulty level
      const sortedCards = [...sectionCards].sort((a, b) => {
        const aReviewed = userProgress.reviewedFlashcards.includes(a.id);
        const bReviewed = userProgress.reviewedFlashcards.includes(b.id);
        
        // Unreviewed cards first
        if (aReviewed && !bReviewed) return 1;
        if (!aReviewed && bReviewed) return -1;
        
        // Then sort by difficulty level
        const difficultyOrder = { 'Basic': 0, 'Intermediate': 1, 'Advanced': 2 };
        const aDifficulty = a.difficulty ? difficultyOrder[a.difficulty as keyof typeof difficultyOrder] : 0;
        const bDifficulty = b.difficulty ? difficultyOrder[b.difficulty as keyof typeof difficultyOrder] : 0;
        return aDifficulty - bDifficulty;
      });
      
      setCardsInCurrentSection(sortedCards);
      setCurrentCardIndex(0);
      setActiveCardId(sortedCards[0]?.id || null);
    }
  }, [currentSectionId, groupedCards, userProgress.reviewedFlashcards]);
  
  const toggleCardReviewed = (flashcardId: number) => {
    const isCurrentlyReviewed = userProgress.reviewedFlashcards.includes(flashcardId);
    
    setUserProgress(prev => {
      const newReviewedFlashcards = isCurrentlyReviewed
        ? prev.reviewedFlashcards.filter(id => id !== flashcardId)
        : [...prev.reviewedFlashcards, flashcardId];
      
      return {
        ...prev,
        reviewedFlashcards: newReviewedFlashcards
      };
    });
    
    // Show toast only when marking as reviewed
    if (!isCurrentlyReviewed) {
      // Apply animation to the checkmark
      if (cardRef.current) {
        cardRef.current.classList.add('flashcard-pulse');
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.classList.remove('flashcard-pulse');
          }
        }, 600);
      }
      
      // If this was the last card in the section, show a completion toast
      const isLastCard = currentCardIndex === cardsInCurrentSection.length - 1;
      const allCardsReviewed = cardsInCurrentSection.every(
        card => card.id === flashcardId || userProgress.reviewedFlashcards.includes(card.id)
      );
      
      if (isLastCard || allCardsReviewed) {
        toast({
          title: "Topic completed!",
          description: "Great job reviewing all flashcards in this topic.",
          duration: 3000,
        });
        
        // Return to topics view after a short delay
        setTimeout(() => {
          setViewMode('topics');
          setCurrentSectionId(null);
        }, 1500);
      } else {
        // Move to next card after a short delay
        setTimeout(() => {
          goToNextCard();
        }, 800);
      }
    }
  };
  
  const handleSwipe = (direction: "left" | "right") => {
    if (!cardsInCurrentSection.length) return;
    
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === "left" && currentCardIndex < cardsInCurrentSection.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setActiveCardId(cardsInCurrentSection[currentCardIndex + 1].id);
      } else if (direction === "right" && currentCardIndex > 0) {
        setCurrentCardIndex(prev => prev - 1);
        setActiveCardId(cardsInCurrentSection[currentCardIndex - 1].id);
      }
      setSwipeDirection(null);
    }, 300);
  };
  
  const goToNextCard = () => {
    if (currentCardIndex < cardsInCurrentSection.length - 1) {
      handleSwipe("left");
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      handleSwipe("right");
    }
  };
  
  const selectSection = (sectionId: number) => {
    setCurrentSectionId(sectionId);
    setViewMode('cards');
  };
  
  const exitCardsView = () => {
    setViewMode('topics');
    setCurrentSectionId(null);
    setActiveCardId(null);
  };
  
  const getPercentCompleted = (sectionId: number) => {
    if (!groupedCards[sectionId]) return 0;
    
    const totalCards = groupedCards[sectionId].length;
    if (totalCards === 0) return 0;
    
    const reviewedCount = groupedCards[sectionId].filter(
      card => userProgress.reviewedFlashcards.includes(card.id)
    ).length;
    
    return Math.round((reviewedCount / totalCards) * 100);
  };
  
  const getSectionIcon = (sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.icon : "fa-book";
  };
  
  const getSectionTitle = (sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.title : "Unknown Topic";
  };
  
  const getAvailableSections = () => {
    return Object.keys(groupedCards).map(id => parseInt(id));
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <BookOpen size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Cards to Revise</h2>
            <p className="text-gray-600 mb-4">Complete some audibles in the Learn section to unlock flashcards.</p>
            <Button onClick={() => window.location.href = "/learn"}>
              Go to Learn
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b flex items-center">
        {viewMode === 'cards' && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={exitCardsView}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {viewMode === 'topics' 
            ? 'Revise' 
            : getSectionTitle(currentSectionId || 0)
          }
        </h1>
      </header>
      
      <main className="p-4">
        {viewMode === 'topics' && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Select a topic to review flashcards
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableSections().map(sectionId => (
                <Card 
                  key={sectionId}
                  className="topic-card cursor-pointer hover:border-primary transition-all"
                  onClick={() => selectSection(sectionId)}
                >
                  <CardContent className="p-4 flex">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 pulse-bg">
                      <i className={`fas ${getSectionIcon(sectionId)} text-primary text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{getSectionTitle(sectionId)}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          {groupedCards[sectionId]?.length || 0} flashcards
                        </div>
                        <Badge variant={getPercentCompleted(sectionId) === 100 ? "default" : "outline"}>
                          {getPercentCompleted(sectionId)}% complete
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {viewMode === 'cards' && cardsInCurrentSection.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-2 text-center">
              Card {currentCardIndex + 1} of {cardsInCurrentSection.length} • Swipe to navigate
            </div>
            
            <div className="relative h-[450px]">
              <AnimatePresence>
                <motion.div
                  key={activeCardId}
                  ref={cardRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                    rotate: swipeDirection === 'left' ? -5 : swipeDirection === 'right' ? 5 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) {
                      handleSwipe("right");
                    } else if (info.offset.x < -100) {
                      handleSwipe("left");
                    }
                  }}
                  className={`absolute inset-0 flashcard-enter ${swipeDirection ? `flashcard-swipe-${swipeDirection}` : ''}`}
                >
                  <Card className="h-full overflow-hidden">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Top half - Illustration */}
                      <div className="h-1/2 bg-gray-50 flex items-center justify-center p-6 border-b">
                        {cardsInCurrentSection[currentCardIndex]?.lineIllustration ? (
                          <div 
                            className="w-full h-full flex items-center justify-center text-primary"
                            dangerouslySetInnerHTML={{ 
                              __html: cardsInCurrentSection[currentCardIndex].lineIllustration || '' 
                            }}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                            <BookOpen size={48} />
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom half - Content */}
                      <div className="h-1/2 p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {cardsInCurrentSection[currentCardIndex]?.title || "Flashcard"}
                          </h2>
                          <Badge variant="outline" className="ml-2">
                            {cardsInCurrentSection[currentCardIndex]?.difficulty || "Basic"}
                          </Badge>
                        </div>
                        
                        <ul className="space-y-2 flex-1 overflow-y-auto">
                          {cardsInCurrentSection[currentCardIndex]?.points.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <i className="fas fa-circle text-xs text-primary mt-1.5 mr-3"></i>
                              <span className="text-gray-700 text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-auto pt-3 border-t flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={goToPrevCard}
                              disabled={currentCardIndex === 0}
                            >
                              <i className="fas fa-chevron-left mr-1"></i>
                              Prev
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={goToNextCard}
                              disabled={currentCardIndex === cardsInCurrentSection.length - 1}
                            >
                              Next
                              <i className="fas fa-chevron-right ml-1"></i>
                            </Button>
                          </div>
                          
                          <Button
                            variant={userProgress.reviewedFlashcards.includes(cardsInCurrentSection[currentCardIndex].id) ? "default" : "outline"}
                            size="sm"
                            className={`flex items-center ${userProgress.reviewedFlashcards.includes(cardsInCurrentSection[currentCardIndex].id) ? 'bg-primary text-white' : 'text-gray-700'}`}
                            onClick={() => toggleCardReviewed(cardsInCurrentSection[currentCardIndex].id)}
                          >
                            <i className={`${userProgress.reviewedFlashcards.includes(cardsInCurrentSection[currentCardIndex].id) ? 'fas check-animate' : 'far'} fa-check mr-2`}></i>
                            Mark Reviewed
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
