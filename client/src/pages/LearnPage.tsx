import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, Audible } from "@/types";
import { 
  Search,
  Headphones,
  Play,
  Bookmark,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  DollarSign,
  ShieldCheck,
  Edit,
  Clock
} from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { mockSections } from "@/lib/mock-data";

// Icon mapping for sections
const SectionIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'Lightbulb':
      return <Lightbulb className="h-5 w-5 text-primary" />;
    case 'DollarSign':
      return <DollarSign className="h-5 w-5 text-blue-500" />;
    case 'ShieldCheck':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'Edit':
      return <Edit className="h-5 w-5 text-blue-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-primary" />;
  }
};

// Background colors for sections
const sectionColors: Record<string, string> = {
  'primary': 'bg-primary/5',
  'blue': 'bg-blue-500/5',
  'green': 'bg-green-500/5',
  'purple': 'bg-purple-500/5',
  'default': 'bg-gray-100',
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

// Helper to calculate total minutes in a section
const calculateTotalMinutes = (audibles: Audible[]) => {
  return Math.floor(audibles.reduce((total, audible) => total + audible.duration, 0) / 60);
};

interface BookmarkState {
  [key: string]: boolean;
}

interface LearnPageProps {
  playAudible: (audible: Audible) => void;
}

export default function LearnPage({ playAudible }: LearnPageProps) {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkState>("bookmarks", {});
  const [sections] = useState<Section[]>(mockSections);
  const [listenedAudibles] = useState<string[]>([]); // Mock listened audibles
  const [filteredSections, setFilteredSections] = useState<Section[]>(sections);
  
  // Handle search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSections(sections);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = sections.map(section => {
      // Keep section if title matches
      if (section.title.toLowerCase().includes(query)) {
        return section;
      }
      
      // Otherwise, filter audibles within the section
      const filteredAudibles = section.audibles.filter(audible => 
        audible.title.toLowerCase().includes(query) || 
        audible.summary.toLowerCase().includes(query)
      );
      
      // Only include this section if it has matching audibles
      return filteredAudibles.length > 0 
        ? { ...section, audibles: filteredAudibles } 
        : null;
    }).filter(Boolean) as Section[];
    
    setFilteredSections(filtered);
  }, [searchQuery, sections]);
  
  const handlePlayAudible = (audible: Audible) => {
    playAudible(audible);
    setLocation(`/audio/${audible.id}`);
  };
  
  const toggleBookmark = (audibleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks({
      ...bookmarks,
      [audibleId]: !bookmarks[audibleId]
    });
  };
  
  const expandAll = () => {
    setExpandedSections(sections.map(section => section.id));
  };
  
  const collapseAll = () => {
    setExpandedSections([]);
  };
  
  const handleAccordionChange = (value: string[]) => {
    setExpandedSections(value);
  };
  
  const isAudibleCompleted = (audibleId: string) => {
    return listenedAudibles.includes(audibleId);
  };
  
  // Count completed audibles in a section
  const getCompletedCountForSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    return section.audibles.filter(audible => 
      isAudibleCompleted(audible.id)
    ).length;
  };
  
  return (
    <div className="flex-1 overflow-auto pb-20 pt-6 scroll-smooth">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Learn</h1>
          <p className="text-gray-600">Browse audible sections by topic</p>
        </header>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search topics & audibles..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Expand/Collapse Controls */}
        <div className="flex justify-end mb-4 space-x-4 text-sm hidden sm:flex">
          <button
            onClick={expandAll}
            className="text-primary hover:text-primary-dark flex items-center"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-primary hover:text-primary-dark flex items-center"
          >
            <ChevronUp className="h-4 w-4 mr-1" /> 
            Collapse All
          </button>
        </div>
        
        <div className="space-y-4">
          <Accordion 
            type="multiple" 
            value={expandedSections}
            onValueChange={handleAccordionChange}
            className="w-full"
          >
            {filteredSections.map((section) => {
              const completedCount = getCompletedCountForSection(section.id);
              const totalAudibles = section.audibles.length;
              const totalMinutes = calculateTotalMinutes(section.audibles);
              const backgroundColor = sectionColors[section.color] || sectionColors.default;
              
              return (
                <AccordionItem 
                  key={section.id} 
                  value={section.id}
                  className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm ${backgroundColor}`}
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50/50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className={`bg-${section.color}-100 rounded-full p-2 mr-3`}>
                          <SectionIcon icon={section.icon} />
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {/* Progress Chip */}
                        <div className="hidden sm:block">
                          <Badge variant="outline" className="text-xs font-normal">
                            {completedCount}/{totalAudibles} ✓
                          </Badge>
                        </div>
                        
                        {/* Minutes Badge */}
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {totalMinutes} min
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {section.audibles.map((audible) => {
                        const isCompleted = isAudibleCompleted(audible.id);
                        const isBookmarked = bookmarks[audible.id] || false;
                        
                        return (
                          <div 
                            key={audible.id} 
                            className={`border-t border-gray-100 pt-3 ${isCompleted ? 'bg-gray-50/50' : ''}`}
                            onClick={() => handlePlayAudible(audible)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Headphones className={`h-5 w-5 ${isCompleted ? 'text-primary' : 'text-gray-400'}`} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0"> {/* min-width prevents overflow */}
                                <h3 className="font-medium text-sm">{audible.title}</h3>
                                <p className="text-xs text-gray-600 mt-1 truncate">{audible.summary}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-2">
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDuration(audible.duration)}
                                </Badge>
                                <button 
                                  className={`text-gray-400 hover:text-yellow-500 ${isBookmarked ? 'text-yellow-500' : ''}`}
                                  onClick={(e) => toggleBookmark(audible.id, e)}
                                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                                >
                                  <Bookmark className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-primary hover:text-primary-dark"
                                  aria-label={`Play ${audible.title}`}
                                >
                                  <Play className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          
          {filteredSections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <button 
                className="text-primary mt-2 hover:underline"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}