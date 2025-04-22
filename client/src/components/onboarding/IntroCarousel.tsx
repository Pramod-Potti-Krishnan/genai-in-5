import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntroCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    title: "Welcome to GenAI in 5",
    content: "5-minute audibles on Generative AI—learn anywhere, anytime."
  },
  {
    title: "Personalized Learning",
    content: "Personalized playlists keep you moving forward at your own pace."
  },
  {
    title: "Test Your Knowledge",
    content: "Revise with flashcards & test yourself with quick trivia to lock in knowledge."
  }
];

export default function IntroCarousel({ onComplete, onSkip }: IntroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto bg-card rounded-xl shadow-lg overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 z-10" 
          onClick={onSkip}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-6">
          <div className="flex overflow-hidden relative">
            <div 
              className="flex transition-transform duration-300 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div 
                  key={index} 
                  className="w-full min-w-full px-4 flex flex-col items-center justify-center"
                >
                  <h2 className="text-2xl font-bold text-center mb-4">{slide.title}</h2>
                  <p className="text-center text-muted-foreground">{slide.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-1 mt-6">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all", 
                  index === currentSlide 
                    ? "w-6 bg-primary" 
                    : "w-1.5 bg-muted"
                )}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            {currentSlide > 0 ? (
              <Button 
                variant="outline" 
                onClick={prevSlide}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div /> // Empty div for spacing
            )}
            
            <Button 
              onClick={nextSlide}
              className="flex items-center gap-1"
            >
              {currentSlide === slides.length - 1 ? "Start Tour" : "Next"}
              {currentSlide < slides.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}