import { useEffect, useState } from "react";
import { sections, audibles, triviaCategories } from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../components/AuthProvider";
import { StatCard } from "@/components/progress/StatCard";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CountUp } from "@/components/ui/count-up";
import { AchievementBadge } from "@/components/progress/AchievementBadge";
import { ScoreboardMetric } from "@/components/progress/ScoreboardMetric";
import { TopicMasteryAccordion } from "@/components/progress/TopicMasteryAccordion";
import { BookOpen, Award, Brain, Flame, TrendingUp, Zap, Star, Medal } from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();
  const [userProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [sectionProgress, setSectionProgress] = useState<{title: string, completed: number, total: number}[]>([]);
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [topicProgress, setTopicProgress] = useState<{title: string, percent: number}[]>([]);
  
  // Calculate achievements based on user progress
  const achievements = [
    {
      id: "streak-3",
      title: "Fast Learner",
      description: "Maintain a 3-day learning streak",
      icon: "fa-fire",
      unlocked: userProgress.streakDays >= 3,
      progress: Math.min(userProgress.streakDays, 3),
      total: 3
    },
    {
      id: "streak-7",
      title: "Consistent Student",
      description: "Maintain a 7-day learning streak",
      icon: "fa-calendar-check",
      unlocked: userProgress.streakDays >= 7,
      progress: Math.min(userProgress.streakDays, 7),
      total: 7
    },
    {
      id: "listen-10",
      title: "Audio Explorer",
      description: "Listen to 10 audio lessons",
      icon: "fa-headphones",
      unlocked: userProgress.completedAudibles.length >= 10,
      progress: userProgress.completedAudibles.length,
      total: 10
    },
    {
      id: "flashcards-20",
      title: "Knowledge Builder",
      description: "Review 20 flashcards",
      icon: "fa-brain",
      unlocked: userProgress.reviewedFlashcards.length >= 20,
      progress: userProgress.reviewedFlashcards.length,
      total: 20
    },
    {
      id: "trivia-perfect",
      title: "Trivia Master",
      description: "Score 100% on any trivia category",
      icon: "fa-award",
      unlocked: Object.values(userProgress.triviaScores).some(
        score => score.score === score.total && score.total > 0
      ),
      progress: Math.max(
        ...Object.values(userProgress.triviaScores).map(
          score => Math.round((score.score / score.total) * 100) || 0
        ),
        0
      ),
      total: 100
    }
  ];

  // Active achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
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
    
    // Overall completion percentage
    const totalAudibles = audibles.length;
    const completedCount = userProgress.completedAudibles.length;
    const overallPercent = totalAudibles > 0 
      ? Math.round((completedCount / totalAudibles) * 100) 
      : 0;
    
    // Generate topic progress data
    const topics = sectionsWithProgress.map(section => ({
      title: section.title,
      percent: section.total > 0 
        ? Math.round((section.completed / section.total) * 100) 
        : 0
    }));
    
    setSectionProgress(sectionsWithProgress);
    setOverallCompletion(overallPercent);
    setTopicProgress(topics);
  }, [userProgress]);
  
  if (!user) return null;
  
  // Calculate total stats
  const totalListened = userProgress.completedAudibles.length;
  const totalReviewed = userProgress.reviewedFlashcards.length;
  const totalTrivia = Object.values(userProgress.triviaScores).reduce(
    (sum, score) => sum + score.score, 0
  );
  
  // Calculate trivia mastery percentage
  const triviaAttempted = Object.values(userProgress.triviaScores).reduce(
    (sum, score) => sum + score.total, 0
  );
  const triviaMastery = triviaAttempted > 0 
    ? Math.round((totalTrivia / triviaAttempted) * 100) 
    : 0;
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-sm text-gray-600 mt-1">Track your learning journey</p>
        </div>
      </header>
      
      <main className="max-w-md mx-auto p-4 space-y-8">
        {/* Progress Overview */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <TrendingUp size={18} className="mr-2 text-primary" />
            Progress Overview
          </h2>
          
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <ProgressRing 
                percent={overallCompletion} 
                size={150} 
                strokeWidth={10}
                progressColor="var(--primary)"
                label={
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-primary">
                      <CountUp end={overallCompletion} suffix="%" />
                    </span>
                    <span className="text-xs text-gray-500">Completion</span>
                  </div>
                }
              />
              
              <div className="mt-4 text-sm text-gray-600">
                {overallCompletion < 25 && "Just getting started! Keep going!"}
                {overallCompletion >= 25 && overallCompletion < 50 && "Making good progress!"}
                {overallCompletion >= 50 && overallCompletion < 75 && "Halfway there! You're doing great!"}
                {overallCompletion >= 75 && overallCompletion < 100 && "Almost there! The finish line is in sight!"}
                {overallCompletion === 100 && "Amazing! You've completed all content!"}
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Stats */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Zap size={18} className="mr-2 text-primary" />
            Learning Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              title="Audibles Completed"
              value={totalListened}
              icon="fa-headphones"
              description="Audio lessons listened"
              color="text-blue-500"
              total={audibles.length}
            />
            
            <StatCard 
              title="Flashcards Reviewed"
              value={totalReviewed}
              icon="fa-layer-group"
              description="Knowledge reinforced"
              color="text-purple-500"
            />
            
            <StatCard 
              title="Current Streak"
              value={userProgress.streakDays}
              icon="fa-fire"
              description="Days in a row"
              color="text-orange-500"
            />
            
            <StatCard 
              title="Trivia Mastery"
              value={triviaMastery}
              icon="fa-brain"
              description="Quiz performance"
              color="text-green-500"
              suffix="%"
            />
          </div>
        </section>
        
        {/* Achievements */}
        <section className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Award size={18} className="mr-2 text-primary" />
              Achievements
            </h2>
            <span className="text-sm text-gray-500">
              {unlockedAchievements.length}/{achievements.length} Unlocked
            </span>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {achievements.map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    id={achievement.id}
                    title={achievement.title}
                    description={achievement.description}
                    icon={achievement.icon}
                    unlocked={achievement.unlocked}
                    progress={!achievement.unlocked ? achievement.progress : undefined}
                    total={!achievement.unlocked ? achievement.total : undefined}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Scoreboard */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Medal size={18} className="mr-2 text-primary" />
            Learning Scoreboard
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <ScoreboardMetric 
              title="Weekly Progress" 
              value={Math.round(overallCompletion * 0.7)} 
              icon="fa-chart-line"
              percent={Math.round(overallCompletion * 0.7)}
              delta={2}
            />
            
            <ScoreboardMetric 
              title="Avg. Trivia Score" 
              value={triviaMastery} 
              icon="fa-star"
              suffix="%"
              delta={-5}
            />
          </div>
        </section>
        
        {/* Topic Mastery */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <BookOpen size={18} className="mr-2 text-primary" />
            Topic Mastery
          </h2>
          
          <TopicMasteryAccordion topics={topicProgress} />
        </section>
      </main>
    </div>
  );
}
