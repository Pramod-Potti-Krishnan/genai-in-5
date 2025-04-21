import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { audibles, sections } from '../../lib/mockData';
import { ProgressRing } from '../ui/progress-ring';

// Define a FlashcardType that matches our mockData structure
interface FlashcardType {
  id: number;
  audibleId: number;
  points: string[];
  isReviewed?: boolean;
}

interface FlashcardProps {
  flashcard: FlashcardType;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
}

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1677442135681-6523653d3d26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
];

// Difficulty levels based on the number of points
const getDifficulty = (points: string[]): string => {
  if (points.length <= 2) return 'Basic';
  if (points.length <= 4) return 'Intermediate';
  return 'Advanced';
};

export default function Flashcard({ flashcard, onCorrect, onIncorrect, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null);
  
  // Get related data
  const audible = audibles.find(a => a.id === flashcard.audibleId);
  const section = sections.find(s => s.id === audible?.sectionId);
  
  // Set up display data
  const coverImage = audible?.coverImage || UNSPLASH_IMAGES[flashcard.id % UNSPLASH_IMAGES.length];
  const audibleTitle = audible?.title || 'GenAI Concepts';
  const sectionTitle = section?.title || 'AI Topics';
  const difficulty = getDifficulty(flashcard.points);
  
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
    <div className="flashcard-container mx-auto my-4" aria-label="flip card">
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
        onClick={!isFlipped ? handleFlip : undefined}
      >
        {/* Front of card */}
        <div 
          className="flashcard-front" 
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <h3>{audibleTitle}</h3>
          <p className="text-sm z-10 opacity-80">{sectionTitle}</p>
          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
            {difficulty}
          </span>
          
          {/* Progress indicator */}
          <div className="absolute top-2 right-16 z-10">
            <ProgressRing
              percent={flashcard.isReviewed ? 100 : 0}
              size={32}
              strokeWidth={3}
            />
          </div>
        </div>
        
        {/* Back of card */}
        <div className="flashcard-back">
          <h4 className="text-lg font-semibold mb-2 text-primary">Key Points:</h4>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {flashcard.points.map((point, index) => (
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