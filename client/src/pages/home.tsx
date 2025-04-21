import { useAppContext } from "@/app-context";
import { getNextAudible, recentAudibles } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";

export default function Home() {
  const { user, playAudible, getCompletionPercentage, progress } = useAppContext();
  const nextAudible = getNextAudible();
  const completionPercentage = getCompletionPercentage();
  const completedCount = progress.listenedAudibles.length;
  
  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </header>
        
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Next Up</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-primary-100 rounded-full p-3 mr-4">
                  <Volume2 className="h-6 w-6 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{nextAudible.title}</h3>
                  <p className="text-sm text-gray-600">
                    {Math.floor(nextAudible.duration / 60)} minutes · {nextAudible.sectionId.replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-3">{nextAudible.summary}</p>
                <Button 
                  className="bg-primary-500 text-white px-4 py-2 rounded-full font-medium flex items-center justify-center hover:bg-primary-600 transition"
                  onClick={() => playAudible(nextAudible)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall completion</span>
                <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{completedCount} of 20 audibles completed</span>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Audibles</h2>
            <a href="#" className="text-sm font-medium text-primary-500">View all</a>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {recentAudibles.map((audible) => (
              <div key={audible.id} className="flex-shrink-0 w-48 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-24 bg-gray-200 flex items-center justify-center">
                  <Volume2 className="h-10 w-10 text-gray-400" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{audible.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{Math.floor(audible.duration / 60)} minutes</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
