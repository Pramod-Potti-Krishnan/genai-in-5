import { useState } from "react";
import { useOnboarding } from "../../hooks/use-onboarding";
import { useAuth } from "../../components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export function OnboardingModal() {
  const { user } = useAuth();
  const { shouldShowOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const [activeTab, setActiveTab] = useState("welcome");
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleComplete = async () => {
    setIsCompleting(true);
    await completeOnboarding();
    setIsCompleting(false);
  };
  
  const handleSkip = async () => {
    await skipOnboarding();
  };
  
  // Don't render if not logged in or shouldn't show onboarding
  if (!user || !shouldShowOnboarding) return null;
  
  const firstName = user.firstName || user.name?.split(' ')[0] || 'there';
  
  return (
    <Dialog open={shouldShowOnboarding} onOpenChange={() => {}}>
      <DialogContent className="max-w-[90vw] md:max-w-[600px] h-[80vh] md:h-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to Audible Learning</DialogTitle>
          <DialogDescription>
            Let's get you started with a quick tour of our app.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-4 flex flex-col h-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="revise">Revise</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
          </TabsList>
          
          <div className="flex-grow overflow-y-auto px-1">
            <TabsContent value="welcome" className="h-full">
              <div className="flex flex-col space-y-4 items-center text-center h-full justify-center">
                <h3 className="text-xl font-semibold">Hi, {firstName}!</h3>
                <p className="text-muted-foreground">
                  Welcome to your personalized micro-learning platform. We're excited to help you
                  grow your knowledge with bite-sized audio learning.
                </p>
                <div className="flex items-center justify-center p-6 bg-primary/10 rounded-lg">
                  <div className="text-5xl font-bold text-primary">Audible Learning</div>
                </div>
                <p>
                  Follow this guide to discover all the features available to you.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="learn" className="h-full">
              <div className="flex flex-col space-y-4 h-full">
                <h3 className="text-xl font-semibold">Learn on the Go</h3>
                <p className="text-muted-foreground">
                  Our audio lessons are designed to fit into your busy day. Each lesson is under 10 minutes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium">Browse Topics</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore our catalog of courses organized by topics
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium">Audio Player</h4>
                    <p className="text-sm text-muted-foreground">
                      Listen to high-quality audio lessons with playback controls
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium">Transcripts</h4>
                    <p className="text-sm text-muted-foreground">
                      Read along with the audio for enhanced learning
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium">Bookmarks</h4>
                    <p className="text-sm text-muted-foreground">
                      Save your favorite lessons for quick access
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="revise" className="h-full">
              <div className="flex flex-col space-y-4 h-full">
                <h3 className="text-xl font-semibold">Revise with Flashcards</h3>
                <p className="text-muted-foreground">
                  Reinforce your learning with interactive flashcards and quiz yourself on key concepts.
                </p>
                <div className="mt-4 bg-card border rounded-lg p-6 flex flex-col items-center">
                  <div className="w-full aspect-video bg-primary/10 rounded-md flex items-center justify-center">
                    <p className="text-lg font-medium">Flashcard Front</p>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Tap or click to flip the card and reveal the answer
                    </p>
                  </div>
                </div>
                <p>
                  After listening to a lesson, head to the Revise section to test your knowledge with
                  flashcards and quizzes.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="track" className="h-full">
              <div className="flex flex-col space-y-4 h-full">
                <h3 className="text-xl font-semibold">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your learning journey and build consistent habits with our tracking tools.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">7</div>
                    <div className="text-sm">Day Streak</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">12</div>
                    <div className="text-sm">Lessons Completed</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">85%</div>
                    <div className="text-sm">Quiz Score</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">LVL 3</div>
                    <div className="text-sm">Current Level</div>
                  </div>
                </div>
                <p>
                  The Progress section shows your achievements, streaks, and learning statistics to
                  keep you motivated.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handleSkip}>
            Skip Tour
          </Button>
          
          {activeTab === "track" ? (
            <Button onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Started
            </Button>
          ) : (
            <Button onClick={() => {
              const tabs = ["welcome", "learn", "revise", "track"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}>
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}