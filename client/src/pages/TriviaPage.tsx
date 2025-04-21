import { useState } from "react";
import { triviaCategories, triviaQuestions } from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { defaultUserProgress, UserProgressData } from "../lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "../components/AuthProvider";

export default function TriviaPage() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useLocalStorage<UserProgressData>("userProgress", defaultUserProgress);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"categories" | "quiz" | "results">("categories");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<{score: number, total: number} | null>(null);
  
  const startQuiz = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentStep("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
  };
  
  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = parseInt(value);
    setSelectedAnswers(newAnswers);
  };
  
  const nextQuestion = () => {
    if (!selectedCategory) return;
    
    const categoryQuestions = triviaQuestions.filter(q => q.categoryId === selectedCategory);
    
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      categoryQuestions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctOptionIndex) {
          score++;
        }
      });
      
      setQuizScore({
        score,
        total: categoryQuestions.length
      });
      
      // Save score to user progress
      setUserProgress(prev => ({
        ...prev,
        triviaScores: {
          ...prev.triviaScores,
          [selectedCategory]: { score, total: categoryQuestions.length }
        }
      }));
      
      setCurrentStep("results");
    }
  };
  
  const backToCategories = () => {
    setCurrentStep("categories");
    setSelectedCategory(null);
    setQuizScore(null);
  };
  
  if (!user) return null;
  
  const renderCategorySelection = () => (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Category</h2>
      <div className="grid grid-cols-2 gap-3">
        {triviaCategories.map(category => (
          <div 
            key={category.id}
            className="bg-white border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => startQuiz(category.id)}
          >
            <div className={`${category.iconBgColor} ${category.iconTextColor} h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <i className={`fas ${category.icon} text-lg`}></i>
            </div>
            <h3 className="font-medium text-gray-900">{category.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderQuiz = () => {
    if (!selectedCategory) return null;
    
    const categoryQuestions = triviaQuestions.filter(q => q.categoryId === selectedCategory);
    const currentQuestion = categoryQuestions[currentQuestionIndex];
    
    if (!currentQuestion) return null;
    
    const categoryTitle = triviaCategories.find(c => c.id === selectedCategory)?.title || "Quiz";
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{categoryTitle} Quiz</h2>
          <div className="text-sm font-medium text-gray-600">
            Question <span>{currentQuestionIndex + 1}</span>/{categoryQuestions.length}
          </div>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>
            
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex]?.toString()} 
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className="mr-3" />
                  <Label htmlFor={`option-${idx}`} className="text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Button 
          className="w-full"
          onClick={nextQuestion}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
        >
          {currentQuestionIndex < categoryQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </div>
    );
  };
  
  const renderResults = () => {
    if (!quizScore) return null;
    
    const percentage = Math.round((quizScore.score / quizScore.total) * 100);
    let message = "Well done!";
    
    if (percentage < 40) message = "Keep practicing!";
    else if (percentage < 70) message = "Good job!";
    else if (percentage < 90) message = "Excellent work!";
    else message = "Perfect score!";
    
    return (
      <div className="text-center py-6">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              style={{
                strokeDasharray: 251.2,
                strokeDashoffset: 251.2 - (251.2 * percentage) / 100,
                transform: "rotate(-90deg)",
                transformOrigin: "center"
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{quizScore.score}/{quizScore.total}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600 mb-6">
          You scored {quizScore.score} out of {quizScore.total} questions correctly.
        </p>
        
        <Button onClick={backToCategories}>
          Try Another Category
        </Button>
      </div>
    );
  };
  
  return (
    <div className="flex-1 pb-16">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Trivia</h1>
      </header>
      
      <main className="p-4">
        {currentStep === "categories" && renderCategorySelection()}
        {currentStep === "quiz" && renderQuiz()}
        {currentStep === "results" && renderResults()}
      </main>
    </div>
  );
}
