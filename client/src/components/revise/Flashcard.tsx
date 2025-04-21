import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { audibles } from '../../lib/mockData';
import { flashcards } from '../../lib/mockData';
import { ProgressRing } from '../ui/progress-ring';

// Define a FlashcardType that matches our mockData structure
interface FlashcardType {
  id: number;
  audibleId: number;
  points: string[];
  title?: string; // Optional fields for our UI
  image?: string;
  isReviewed?: boolean;
}

interface FlashcardProps {
  flashcard: FlashcardType;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
}

export default function Flashcard({ flashcard, onCorrect, onIncorrect, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null);
  
  // Find the associated audible to get the cover image
  const audible = audibles.find(a => a.id === flashcard.audibleId);
  const coverImage = audible?.coverImage || 'https://images.unsplash.com/photo-1655720035441-3e7af3144a55';
  
  // Use mock data for the demo
  const sectionTitle = audible ? "AI & Machine Learning" : "Technology";
  const audibleTitle = audible ? audible.title : "Understanding Neural Networks";
  const difficulty = flashcard.points.length <= 2 ? 'Basic' : flashcard.points.length <= 4 ? 'Intermediate' : 'Advanced';
  
  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };
  
  const handleAnswer = (answer: 'correct' | 'incorrect') => {
    setUserAnswer(answer);
    if (answer === 'correct') {
      onCorrect();
    } else {
      onIncorrect();
    }
  };
  
  const resetCard = () => {
    setIsFlipped(false);
    setUserAnswer(null);
    onNext();
  };
  
  return (
    <div className="flashcard-container mx-auto my-4">
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
        onClick={!isFlipped ? handleFlip : undefined}
      >
        {/* Front of card */}
        <div 
          className="flashcard-front" 
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <h3>{flashcard.audibleTitle}</h3>
          <p className="text-sm z-10 opacity-80">{flashcard.sectionTitle}</p>
          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
            {flashcard.difficulty}
          </span>
        </div>
        
        {/* Back of card */}
        <div className="flashcard-back">
          <h4 className="text-lg font-semibold mb-2 text-primary">Key Points:</h4>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {flashcard.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          
          {!userAnswer ? (
            <div className="flex justify-between mt-auto">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleAnswer('incorrect')}
                className="flex items-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Missed
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleAnswer('correct')}
                className="flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Got it
              </Button>
            </div>
          ) : (
            <div className="flex justify-center mt-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetCard}
                className="flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Next Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}