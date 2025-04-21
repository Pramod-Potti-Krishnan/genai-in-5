import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TopicProgress {
  title: string;
  percent: number;
}

interface TopicMasteryAccordionProps {
  topics: TopicProgress[];
}

export function TopicMasteryAccordion({ topics }: TopicMasteryAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };
  
  // Sort topics by completion percentage (descending)
  const sortedTopics = [...topics].sort((a, b) => b.percent - a.percent);
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 border-b flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="font-medium text-gray-900">Topic Mastery</h3>
        <button className="text-gray-500">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {isExpanded && (
        <CardContent className="p-4 grid gap-3">
          {sortedTopics.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800 truncate">{topic.title}</span>
                  <span className="text-xs font-medium text-gray-600">{topic.percent}%</span>
                </div>
                <Progress 
                  value={topic.percent} 
                  className="h-1.5"
                />
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}