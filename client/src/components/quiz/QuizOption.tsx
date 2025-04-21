import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

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
  
  // Animation ref for wrong answer shake
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (isWrong) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  // Determine the appropriate styling based on state
  let optionStyle = "border";
  
  if (showAnswer) {
    if (isCorrect) {
      optionStyle += " border-green-500 bg-green-50";
    } else if (isWrong) {
      optionStyle += " border-red-500 bg-red-50";
    } else {
      optionStyle += " border-gray-200";
    }
  } else {
    optionStyle += isSelected ? " border-primary-400 bg-primary-50" : " border-gray-200";
  }
  
  if (!disabled) {
    optionStyle += " cursor-pointer hover:bg-primary-50";
  }
  
  optionStyle += " rounded-lg p-3 transition";
  
  // Add shake animation class if needed
  if (shake) {
    optionStyle += " animate-shake";
  }
  
  // Determine radio button styling
  let radioStyle = "h-5 w-5 flex-shrink-0 mr-3 rounded-full flex items-center justify-center";
  
  if (showAnswer) {
    if (isCorrect) {
      radioStyle += " bg-green-500 border-green-500";
    } else if (isWrong) {
      radioStyle += " bg-red-500 border-red-500";
    } else if (isSelected) {
      radioStyle += " bg-primary-500 border-primary-500";
    } else {
      radioStyle += " border border-gray-300";
    }
  } else {
    radioStyle += isSelected ? " bg-primary-500 border-primary-500" : " border border-gray-300";
  }
  
  return (
    <div 
      className={optionStyle}
      onClick={() => !disabled && onSelect(index)}
    >
      <div className="flex items-center">
        <div className={radioStyle}>
          {isSelected && !isWrong && <Check className="h-3 w-3 text-white" />}
          {isWrong && <X className="h-3 w-3 text-white" />}
        </div>
        <span className="text-sm text-gray-800">{option}</span>
      </div>
    </div>
  );
}
