import { useState } from "react";
import { useLocation } from "wouter";
import { useAppContext } from "@/app-context";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Section, Audible } from "@/types";
import { 
  Volume2, 
  Play,
  Lightbulb,
  DollarSign,
  ShieldCheck,
  Edit
} from "lucide-react";

// Icon mapping for sections
const SectionIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'Lightbulb':
      return <Lightbulb className="h-5 w-5 text-primary-500" />;
    case 'DollarSign':
      return <DollarSign className="h-5 w-5 text-blue-500" />;
    case 'ShieldCheck':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'Edit':
      return <Edit className="h-5 w-5 text-blue-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-primary-500" />;
  }
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

export default function Learn() {
  const { sections, playAudible } = useAppContext();
  const [_, setLocation] = useLocation();
  
  const handlePlayAudible = (audible: Audible) => {
    playAudible(audible);
    setLocation(`/audio/${audible.id}`);
  };

  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Learn</h1>
          <p className="text-gray-600">Browse audible sections by topic</p>
        </header>
        
        <div className="space-y-4">
          <Accordion type="multiple" className="w-full">
            {sections.map((section) => (
              <AccordionItem 
                key={section.id} 
                value={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`bg-${section.color}-100 rounded-full p-2 mr-3`}>
                      <SectionIcon icon={section.icon} />
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {section.audibles.map((audible) => (
                      <div key={audible.id} className="border-t border-gray-100 pt-3">
                        <div className="flex">
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                              <Volume2 className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{audible.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{formatDuration(audible.duration)}</p>
                            <p className="text-xs text-gray-700 mt-1 line-clamp-2">{audible.summary}</p>
                          </div>
                          <button 
                            className="ml-2 text-primary-500 hover:text-primary-600"
                            onClick={() => handlePlayAudible(audible)}
                            aria-label={`Play ${audible.title}`}
                          >
                            <Play className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
