import { useState } from "react";
import { sections, audibles } from "../lib/mockData";
import { Audible } from "@shared/schema";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useAuth } from "../components/AuthProvider";

interface LearnPageProps {
  playAudible: (audible: Audible) => void;
}

export default function LearnPage({ playAudible }: LearnPageProps) {
  const { user } = useAuth();
  
  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)} min`;
  };
  
  const getAudiblesForSection = (sectionId: number) => {
    return audibles.filter(audible => audible.sectionId === sectionId);
  };
  
  if (!user) return null;
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Learn</h1>
      </header>
      
      <main className="p-4 space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {sections.map(section => (
            <AccordionItem value={`section-${section.id}`} key={section.id} className="border rounded-lg overflow-hidden bg-white shadow-sm mb-4">
              <AccordionTrigger className="px-4 py-4 hover:no-underline font-medium text-gray-900">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {getAudiblesForSection(section.id).map(audible => (
                  <div 
                    key={audible.id} 
                    className="py-3 border-t first:border-t-0 cursor-pointer" 
                    onClick={() => playAudible(audible)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{audible.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {audible.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatDuration(audible.durationInSeconds)}
                      </span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
}
