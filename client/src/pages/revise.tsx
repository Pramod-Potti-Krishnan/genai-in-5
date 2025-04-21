import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Flashcard as FlashcardType } from '../types';
import Flashcard from '../components/revise/Flashcard';
import TopicChips from '../components/revise/TopicChips';
import { flashcards } from '../lib/mockData';
import { ProgressRing } from '../components/ui/progress-ring';
import { ArrowLeft, Award, Book, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';
import { useLocalStorage } from '../lib/useLocalStorage';

export default function Revise() {
  const [location, setLocation] = useLocation();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviewedCardIds, setReviewedCardIds] = useLocalStorage<string[]>('reviewedFlashcards', []);
  const [streak, setStreak] = useLocalStorage<number>('reviewStreak', 0);
  
  // Filter flashcards based on active topic
  const filteredFlashcards = activeTopicId 
    ? flashcards.filter(f => {
        const audibleSection = f.audibleId.toString().charAt(0);
        return audibleSection === activeTopicId;
      })
    : flashcards;
    
  const currentFlashcard = filteredFlashcards[currentIndex];
  const hasCompletedReview = currentIndex >= filteredFlashcards.length;
  
  // Calculate progress
  const progress = filteredFlashcards.length > 0 
    ? Math.round((currentIndex / filteredFlashcards.length) * 100) 
    : 0;
    
  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 0;
    
  const handleCorrect = () => {
    setCorrectCount(prevCount => prevCount + 1);
    const flashcardId = currentFlashcard.id.toString();
    if (!reviewedCardIds.includes(flashcardId)) {
      setReviewedCardIds([...reviewedCardIds, flashcardId]);
    }
  };
  
  const handleIncorrect = () => {
    setIncorrectCount(prevCount => prevCount + 1);
  };
  
  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // Completed all flashcards
      setStreak(prevStreak => prevStreak + 1);
    }
  };
  
  const handleTopicSelect = (topicId: string | null) => {
    setActiveTopicId(topicId);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  };
  
  const handleRestartReview = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  };
  
  return (
    <div className="pb-20">
      <Helmet>
        <title>Review Flashcards | GenAI</title>
      </Helmet>
      
      <div className="sticky top-0 bg-background z-10">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Flashcard Review</h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex gap-2 items-center mr-3">
              <div className="p-1 rounded-full bg-green-100">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">{correctCount}</span>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="p-1 rounded-full bg-red-100">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-sm font-medium">{incorrectCount}</span>
            </div>
          </div>
        </div>
        
        <TopicChips 
          activeTopicId={activeTopicId} 
          onSelectTopic={handleTopicSelect} 
        />
        
        <div className="px-4 pt-2 pb-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-1.5">
            <Book className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {currentIndex}/{filteredFlashcards.length} Cards
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {streak} Day Streak
            </span>
          </div>
          
          <div className="relative">
            <ProgressRing 
              percent={progress} 
              size={36} 
              strokeWidth={4} 
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
              {progress}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {!hasCompletedReview && currentFlashcard ? (
          <Flashcard 
            flashcard={currentFlashcard} 
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            onNext={handleNext}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 min-h-[50vh] text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Review Complete!</h2>
            <p className="text-muted-foreground mb-4">
              You've reviewed all {filteredFlashcards.length} flashcards in this session.
            </p>
            
            {filteredFlashcards.length > 0 && (
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold text-primary">{streak} days</p>
                </div>
              </div>
            )}
            
            <Button onClick={handleRestartReview}>
              Restart Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}