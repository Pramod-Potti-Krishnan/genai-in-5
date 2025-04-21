import { useEffect, useState } from "react";
import { sections, audibles } from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { triviaCategories } from "../lib/mockData";
import { useAuth } from "../components/AuthProvider";

export default function ProgressPage() {
  const { user } = useAuth();
  const [userProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [sectionProgress, setSectionProgress] = useState<{title: string, completed: number, total: number}[]>([]);
  
  useEffect(() => {
    // Calculate progress per section
    const sectionsWithProgress = sections.map(section => {
      const sectionAudibles = audibles.filter(a => a.sectionId === section.id);
      const completedAudibles = sectionAudibles.filter(a => 
        userProgress.completedAudibles.includes(a.id)
      );
      
      return {
        title: section.title,
        completed: completedAudibles.length,
        total: sectionAudibles.length
      };
    });
    
    setSectionProgress(sectionsWithProgress);
  }, [userProgress]);
  
  if (!user) return null;
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
      </header>
      
      <main className="p-4 space-y-6">
        {/* Listen Progress */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Listen Progress</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              {sectionProgress.map((section, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{section.title}</span>
                    <span className="text-sm text-gray-600">{section.completed}/{section.total}</span>
                  </div>
                  <Progress 
                    value={(section.completed / section.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        
        {/* Revision Streak */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Revision Streak</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{userProgress.streakDays}</div>
                  <div className="text-sm text-gray-600">Day streak</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{userProgress.reviewedFlashcards.length}</div>
                  <div className="text-sm text-gray-600">Cards reviewed</div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`h-8 w-8 mx-auto rounded-full ${idx < userProgress.streakDays ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center text-xs font-medium`}>
                      {day}
                    </div>
                    <div className="text-xs mt-1 text-gray-600">{idx + 7}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Trivia Scores */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Trivia Scores</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              {triviaCategories.map(category => {
                const scoreData = userProgress.triviaScores[category.id];
                
                if (!scoreData) return null;
                
                const percentage = (scoreData.score / scoreData.total) * 100;
                
                return (
                  <div key={category.id} className="mb-4 last:mb-0 flex items-center">
                    <div className={`w-10 h-10 rounded-full ${category.iconBgColor} flex items-center justify-center mr-3`}>
                      <i className={`fas ${category.icon} ${category.iconTextColor}`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800">{category.title}</span>
                        <span className="text-sm font-medium text-gray-900">{scoreData.score}/{scoreData.total}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Show message if no trivia taken */}
              {Object.keys(userProgress.triviaScores).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No trivia quizzes taken yet.</p>
                  <p className="text-gray-500 text-sm mt-1">Head to the Trivia tab to test your knowledge!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
