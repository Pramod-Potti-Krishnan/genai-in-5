import { useAppContext } from "@/app-context";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressCard } from "@/components/ui/progress-card";
import {
  BarChart3,
  Zap,
  Clock,
  Award,
  CheckCircle,
  Lightbulb,
  Edit,
  ShieldCheck,
  FlaskRound
} from "lucide-react";

// Icon mapping for categories
const CategoryIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'Lightbulb':
      return <Lightbulb className="h-5 w-5 text-primary-500" />;
    case 'Edit':
      return <Edit className="h-5 w-5 text-blue-500" />;
    case 'ShieldCheck':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'FlaskRound':
      return <FlaskRound className="h-5 w-5 text-purple-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-primary-500" />;
  }
};

export default function Progress() {
  const { sections, triviaCategories, progress, getCompletionPercentage } = useAppContext();

  // Calculate section completion percentages
  const getSectionCompletion = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return { completed: 0, total: 0, percentage: 0 };

    const completedAudibles = section.audibles.filter(audible => 
      progress.listenedAudibles.includes(audible.id)
    ).length;
    
    const total = section.audibles.length;
    const percentage = total > 0 ? Math.round((completedAudibles / total) * 100) : 0;
    
    return { completed: completedAudibles, total, percentage };
  };

  // Get trivia score for a category
  const getCategoryScore = (categoryId: string) => {
    const score = progress.triviaScores.find(s => s.categoryId === categoryId);
    return score?.score || 0;
  };

  // Calculate average quiz score
  const getAverageQuizScore = () => {
    if (progress.triviaScores.length === 0) return 0;
    
    const totalScore = progress.triviaScores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalScore / progress.triviaScores.length;
    
    return Math.round(averageScore * 10); // Convert to percentage based on 10 questions
  };

  // Mock time spent value (would be calculated from actual usage in a real app)
  const timeSpent = "3h 45m";

  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
          <p className="text-gray-600">Track your learning journey</p>
        </header>
        
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Listening Progress</h2>
            <span className="text-sm text-gray-600">
              {progress.listenedAudibles.length}/{sections.reduce((count, section) => count + section.audibles.length, 0)} audibles
            </span>
          </div>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              {sections.map((section) => {
                const { completed, total, percentage } = getSectionCompletion(section.id);
                return (
                  <div key={section.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{section.title}</span>
                      <span className="text-sm text-gray-600">{completed}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${section.color || 'primary'}-500 h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Revision Streak</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-900">Current streak</span>
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {progress.currentStreak} days
                </span>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-1">
                <div className="text-xs text-center text-gray-500">Mon</div>
                <div className="text-xs text-center text-gray-500">Tue</div>
                <div className="text-xs text-center text-gray-500">Wed</div>
                <div className="text-xs text-center text-gray-500">Thu</div>
                <div className="text-xs text-center text-gray-500">Fri</div>
                <div className="text-xs text-center text-gray-500">Sat</div>
                <div className="text-xs text-center text-gray-500">Sun</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="h-10 rounded-md bg-primary-500"></div>
                <div className="h-10 rounded-md bg-primary-500"></div>
                <div className="h-10 rounded-md bg-primary-500"></div>
                <div className="h-10 rounded-md bg-primary-500"></div>
                <div className="h-10 rounded-md bg-gray-100"></div>
                <div className="h-10 rounded-md bg-gray-100"></div>
                <div className="h-10 rounded-md bg-gray-100"></div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{progress.reviewedFlashcards.length} cards reviewed this week</span>
                <span>Best streak: {progress.bestStreak} days</span>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Trivia Scores</h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {triviaCategories.map((category) => {
                  const score = getCategoryScore(category.id);
                  const hasScore = progress.triviaScores.some(s => s.categoryId === category.id);
                  
                  return (
                    <div className="flex items-center" key={category.id}>
                      <div className={`bg-${category.color}-100 rounded-full p-2 mr-3 flex-shrink-0`}>
                        <CategoryIcon icon={category.icon} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{category.title}</h3>
                          <span className="text-sm font-medium">
                            {hasScore ? `${score}/10` : '-'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`${hasScore ? `bg-${category.color}-500` : 'bg-gray-300'} h-1.5 rounded-full`}
                            style={{ width: hasScore ? `${(score / 10) * 100}%` : '0%' }}
                          ></div>
                        </div>
                        {!hasScore && (
                          <div className="text-xs text-gray-500 mt-1">Not attempted yet</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Learning Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <ProgressCard
              title="Time Spent Learning"
              value={timeSpent}
              subtitle="Last 7 days"
              icon={<Clock className="h-5 w-5" />}
            />
            
            <ProgressCard
              title="Completion Rate"
              value={`${getCompletionPercentage()}%`}
              subtitle={`${progress.listenedAudibles.length} of ${sections.reduce((count, section) => count + section.audibles.length, 0)} audibles`}
              icon={<CheckCircle className="h-5 w-5" />}
              color="success"
            />
            
            <ProgressCard
              title="Learning Streak"
              value={`${progress.currentStreak} days`}
              subtitle={`Personal best: ${progress.bestStreak} days`}
              icon={<Zap className="h-5 w-5" />}
              color="blue"
            />
            
            <ProgressCard
              title="Avg. Quiz Score"
              value={`${getAverageQuizScore()}%`}
              subtitle="Across all categories"
              icon={<Award className="h-5 w-5" />}
              color="yellow"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
