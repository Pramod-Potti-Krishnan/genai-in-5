import { CheckCircle, XCircle } from "lucide-react";

interface QuizOptionProps {
  option: string;
  index: number;
  selectedIndex?: number;
  correctIndex?: number;
  showAnswer: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
}

export default function QuizOption({ 
  option, 
  index, 
  selectedIndex, 
  correctIndex,
  showAnswer,
  disabled,
  onSelect 
}: QuizOptionProps) {
  
  const isSelected = selectedIndex === index;
  const isCorrect = correctIndex === index;
  const isWrong = showAnswer && isSelected && !isCorrect;
  
  // Determine the appropriate CSS classes based on the state
  const getOptionClasses = () => {
    let baseClasses = "flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200";
    
    if (disabled) {
      baseClasses += " cursor-default";
    }
    
    if (!showAnswer) {
      // Normal state
      if (isSelected) {
        return `${baseClasses} border-primary-500 bg-primary-50 text-primary-700`;
      }
      return `${baseClasses} border-gray-200 hover:border-gray-300 hover:bg-gray-50`;
    } else {
      // Show answer state
      if (isCorrect) {
        return `${baseClasses} border-green-500 bg-green-50 text-green-700`;
      }
      if (isWrong) {
        return `${baseClasses} border-red-500 bg-red-50 text-red-700 animate-shake`;
      }
      if (isSelected) {
        return `${baseClasses} border-primary-500 bg-primary-50 text-primary-700`;
      }
      return `${baseClasses} border-gray-200 opacity-70`;
    }
  };
  
  return (
    <div 
      className={getOptionClasses()}
      onClick={() => !disabled && onSelect(index)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Option letter indicator */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3
        ${isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}
        ${isCorrect ? 'bg-green-100 text-green-700' : ''}
        ${isWrong ? 'bg-red-100 text-red-700' : ''}
      `}>
        {String.fromCharCode(65 + index)}
      </div>
      
      {/* Option text */}
      <span className="flex-1">{option}</span>
      
      {/* Feedback icons */}
      {showAnswer && isCorrect && (
        <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
      )}
      {showAnswer && isWrong && (
        <XCircle className="h-5 w-5 text-red-500 ml-2" />
      )}
    </div>
  );
}