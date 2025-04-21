import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { getAudibleById } from "@/lib/mock-data";
import { useAppContext } from "@/app-context";
import AudioPlayer from "@/components/audio/AudioPlayer";
import { ChevronLeft } from "lucide-react";

export default function AudioPlayerPage() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/audio/:id");
  const { playAudible } = useAppContext();
  
  const audibleId = params?.id;
  const audible = audibleId ? getAudibleById(audibleId) : null;
  
  useEffect(() => {
    if (audible) {
      playAudible(audible);
    }
  }, [audible, playAudible]);

  if (!audible) {
    return (
      <div className="flex-1 overflow-auto pb-20 pt-6">
        <div className="px-4 max-w-lg mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Audible not found. Please select a valid audible.
                </p>
              </div>
            </div>
          </div>
          <button 
            className="mt-4 inline-flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => setLocation("/learn")}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <button 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => setLocation("/learn")}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Learn
        </button>
        
        <AudioPlayer 
          audible={audible} 
          onBack={() => setLocation("/learn")}
        />
      </div>
    </div>
  );
}
