import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Flashcard } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/app-context";

interface MemoryCardProps {
  flashcard: Flashcard;
  className?: string;
}

export default function MemoryCard({ flashcard, className = "" }: MemoryCardProps) {
  const { markFlashcardReviewed, progress } = useAppContext();
  const [isReviewed, setIsReviewed] = useState<boolean>(
    progress.reviewedFlashcards.includes(flashcard.id)
  );
  
  const difficultyColors = {
    Basic: "bg-primary-100 text-primary-800",
    Intermediate: "bg-blue-100 text-blue-800",
    Advanced: "bg-purple-100 text-purple-800"
  };
  
  const handleToggleReview = (checked: boolean) => {
    setIsReviewed(checked);
    if (checked) {
      markFlashcardReviewed(flashcard.id);
    }
  };
  
  // Format date display
  const formatDate = (date?: Date) => {
    if (!date) return "Never";
    
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-2 h-full flex flex-col ${className}`}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-gray-500">{flashcard.sectionTitle}</span>
          <span className={`${difficultyColors[flashcard.difficulty]} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {flashcard.difficulty}
          </span>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{flashcard.audibleTitle}</h2>
        
        <ul className="space-y-3 mb-4">
          {flashcard.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">Last revised: {formatDate(flashcard.lastReviewed)}</span>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id={`review-${flashcard.id}`} 
            checked={isReviewed}
            onCheckedChange={handleToggleReview}
          />
          <Label 
            htmlFor={`review-${flashcard.id}`}
            className="text-sm font-medium text-gray-700"
          >
            Mark Reviewed
          </Label>
        </div>
      </div>
    </div>
  );
}
