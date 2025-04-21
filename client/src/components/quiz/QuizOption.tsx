import { useState } from "react";
import { Check } from "lucide-react";

interface QuizOptionProps {
  option: string;
  index: number;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export default function QuizOption({ option, index, selectedIndex, onSelect }: QuizOptionProps) {
  const isSelected = selectedIndex === index;
  
  return (
    <div 
      className={`border ${isSelected ? 'border-primary-400 bg-primary-50' : 'border-gray-200'} rounded-lg p-3 cursor-pointer hover:bg-primary-50 transition`}
      onClick={() => onSelect(index)}
    >
      <div className="flex items-center">
        <div className={`h-5 w-5 flex-shrink-0 mr-3 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary-500 border-primary-500' : 'border border-gray-300'}`}>
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </div>
        <span className="text-sm text-gray-800">{option}</span>
      </div>
    </div>
  );
}
