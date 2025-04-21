import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/app-context";
import { getFlashcardsForAudibles } from "@/lib/mock-data";
import MemoryCard from "@/components/cards/MemoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Zap, CheckCircle, Award } from "lucide-react";

export default function Revise() {
  const { progress } = useAppContext();
  const flashcards = getFlashcardsForAudibles(progress.listenedAudibles);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Handle navigation
  const goToNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  
  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  // Scroll to the current card when index changes
  useEffect(() => {
    if (carouselRef.current && flashcards.length > 0) {
      const scrollAmount = currentCardIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentCardIndex, flashcards.length]);
  
  // Handle manual scroll
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentCardIndex) {
        setCurrentCardIndex(newIndex);
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Revise</h1>
          <p className="text-gray-600">Swipe through memory cards to reinforce your learning</p>
        </header>
        
        {flashcards.length > 0 ? (
          <>
            <div className="relative h-[340px] mb-8">
              {/* Memory Card Carousel */}
              <div 
                ref={carouselRef}
                className="memory-card-container flex overflow-x-auto snap-x h-full no-scrollbar"
                onScroll={handleScroll}
              >
                {flashcards.map((flashcard, index) => (
                  <div key={flashcard.id} className="memory-card w-full flex-shrink-0 snap-center">
                    <MemoryCard flashcard={flashcard} />
                  </div>
                ))}
              </div>
              
              {/* Card pagination indicators */}
              <div className="absolute bottom-[-30px] left-0 right-0 flex justify-center space-x-2">
                {flashcards.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentCardIndex ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                    aria-current={index === currentCardIndex}
                    onClick={() => setCurrentCardIndex(index)}
                  />
                ))}
              </div>
              
              {/* Navigation arrows */}
              {currentCardIndex > 0 && (
                <button 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={goToPrevCard}
                  aria-label="Previous card"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              
              {currentCardIndex < flashcards.length - 1 && (
                <button 
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={goToNextCard}
                  aria-label="Next card"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-4">
                <h2 className="font-medium text-gray-900 mb-2">Revision Stats</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current streak</p>
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-primary-500" />
                      <span className="text-xl font-bold ml-1">{progress.currentStreak} days</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Cards reviewed</p>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-xl font-bold ml-1">
                        {progress.reviewedFlashcards.length} of {flashcards.length}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Best streak</p>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="text-xl font-bold ml-1">{progress.bestStreak} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <div className="bg-gray-100 rounded-full p-3 inline-flex mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No flashcards yet</h2>
              <p className="text-gray-600 mb-4">
                Complete audibles in the Learn section to unlock flashcards for revision.
              </p>
              <div className="mt-4">
                <a
                  href="/learn"
                  className="text-primary-500 font-medium hover:text-primary-600"
                >
                  Go to Learn section
                </a>
              </div>
            </CardContent>
          </Card>
        )}
        
        {flashcards.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium text-gray-900 mb-3">Upcoming Reviews</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">AI Ethics in Business</h3>
                    <p className="text-xs text-gray-500">Due tomorrow</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Multimodal AI Models</h3>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
