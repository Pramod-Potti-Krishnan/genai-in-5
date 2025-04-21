import { useState, useEffect } from "react";
import { useAppContext } from "@/app-context";
import { getTriviaQuestions } from "@/lib/mock-data";
import { TriviaQuestion, TriviaCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizOption from "@/components/quiz/QuizOption";
import CountdownTimer from "@/components/quiz/CountdownTimer";
import { ConfettiEffect } from "@/components/ui/confetti";
import { CheckCircle, XCircle, Lightbulb, Edit, ShieldCheck, FlaskRound, ChevronLeft, Star, Timer, Award } from "lucide-react";

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

enum QuizState {
  CATEGORY_SELECTION = 'category-selection',
  QUIZ_INTERFACE = 'quiz-interface',
  QUIZ_RESULTS = 'quiz-results'
}

// Quiz state interface
interface QuizStateData {
  currentIndex: number;
  timeLeft: number;
  selectedOption: number | null;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  showAnswer: boolean;
  isAnswerCorrect: boolean;
  streak: number;
}

export default function Trivia() {
  const { triviaCategories, progress, saveTriviaScore } = useAppContext();
  
  const [quizState, setQuizState] = useState<QuizState>(QuizState.CATEGORY_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<TriviaCategory | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizData, setQuizData] = useState<QuizStateData>({
    currentIndex: 0,
    timeLeft: 10,
    selectedOption: null,
    correctCount: 0,
    wrongCount: 0,
    skippedCount: 0,
    showAnswer: false,
    isAnswerCorrect: false,
    streak: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  
  // Calculate total score (for backward compatibility)
  const score = quizData.correctCount;
  
  // Get the best score for a category
  const getBestScore = (categoryId: string): number | undefined => {
    const triviaScore = progress.triviaScores.find(score => score.categoryId === categoryId);
    return triviaScore?.score;
  };
  
  // Start a quiz for the selected category
  const startQuiz = (category: TriviaCategory) => {
    const categoryQuestions = getTriviaQuestions(category.id);
    setSelectedCategory(category);
    setQuestions(categoryQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(categoryQuestions.length).fill(-1));
    setQuizData({
      currentIndex: 0,
      timeLeft: 10,
      selectedOption: null,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      showAnswer: false,
      isAnswerCorrect: false,
      streak: 0
    });
    setShowAnswer(false);
    setTimerActive(true);
    setQuizState(QuizState.QUIZ_INTERFACE);
  };
  
  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    // If already showing answer, don't allow selection
    if (showAnswer) return;
    
    // Update selected answer
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
    
    // Stop timer and show answer
    setTimerActive(false);
    setShowAnswer(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    // Update quiz data
    setQuizData(prev => ({
      ...prev,
      selectedOption: optionIndex,
      showAnswer: true,
      isAnswerCorrect: isCorrect,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      wrongCount: !isCorrect ? prev.wrongCount + 1 : prev.wrongCount,
      streak: isCorrect ? prev.streak + 1 : 0
    }));
    
    // Show confetti for correct answers
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
    
    // Auto-advance after delay
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        finishQuiz();
      } else {
        goToNextQuestion();
      }
    }, 1500);
  };
  
  // Handle timer timeout
  const handleTimeUp = () => {
    // Mark as skipped
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = -2; // Special value for skipped
    setSelectedAnswers(newSelectedAnswers);
    
    setShowAnswer(true);
    setQuizData(prev => ({
      ...prev,
      skippedCount: prev.skippedCount + 1,
      showAnswer: true,
      streak: 0 // Reset streak on skip
    }));
    
    // Auto-advance after delay
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        finishQuiz();
      } else {
        goToNextQuestion();
      }
    }, 1500);
  };
  
  // Move to the next question or end the quiz
  const goToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setShowAnswer(false);
    setTimerActive(true);
    setQuizData(prev => ({
      ...prev,
      timeLeft: 10,
      selectedOption: null,
      showAnswer: false
    }));
  };
  
  // Finish the quiz and calculate score
  const finishQuiz = () => {
    const correctAnswers = quizData.correctCount;
    
    if (selectedCategory) {
      saveTriviaScore(selectedCategory.id, correctAnswers);
    }
    
    setQuizState(QuizState.QUIZ_RESULTS);
  };
  
  // Reset the quiz
  const resetQuiz = () => {
    setQuizState(QuizState.CATEGORY_SELECTION);
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizData({
      currentIndex: 0,
      timeLeft: 10,
      selectedOption: null,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      showAnswer: false,
      isAnswerCorrect: false,
      streak: 0
    });
  };
  
  // Try the quiz again
  const tryAgain = () => {
    if (selectedCategory) {
      startQuiz(selectedCategory);
    }
  };
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="flex-1 overflow-auto pb-20 pt-6">
      <div className="px-4 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Trivia</h1>
          <p className="text-gray-600">Test your knowledge with fun quizzes</p>
        </header>
        
        {/* Category Selection */}
        {quizState === QuizState.CATEGORY_SELECTION && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {triviaCategories.map((category) => {
              const bestScore = getBestScore(category.id);
              return (
                <Card 
                  key={category.id}
                  className="overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => startQuiz(category)}
                >
                  <CardContent className="p-4">
                    <div className={`bg-${category.color}-100 inline-flex rounded-full p-2 mb-2`}>
                      <CategoryIcon icon={category.icon} />
                    </div>
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{category.questionCount} questions</p>
                    <div className="flex items-center mt-2">
                      {bestScore !== undefined ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs ml-1">Best score: {bestScore}/{category.questionCount}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">Not attempted yet</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Quiz Interface */}
        {quizState === QuizState.QUIZ_INTERFACE && currentQuestion && selectedCategory && (
          <>
            {/* Show confetti effect when answering correctly */}
            <ConfettiEffect active={showConfetti} />
            
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="font-medium text-gray-900 mr-3">{selectedCategory.title} Quiz</h2>
                    {/* Score chip */}
                    <div className="flex items-center text-xs px-3 py-1 rounded-full bg-gray-100">
                      <span className="text-green-600 font-semibold mr-1">{quizData.correctCount} ✓</span>
                      {quizData.wrongCount > 0 && <span className="text-red-600 font-semibold mx-1">{quizData.wrongCount} ✖</span>}
                      {quizData.skippedCount > 0 && <span className="text-orange-500 font-semibold ml-1">{quizData.skippedCount} ⏱</span>}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mb-3">
              <CountdownTimer 
                initialTime={10} 
                onTimeUp={handleTimeUp} 
                isActive={timerActive && !showAnswer} 
              />
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <QuizOption
                      key={index}
                      option={option}
                      index={index}
                      selectedIndex={selectedAnswers[currentQuestionIndex]}
                      correctIndex={showAnswer ? currentQuestion.correctAnswer : undefined}
                      showAnswer={showAnswer}
                      disabled={showAnswer}
                      onSelect={handleSelectOption}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Only show Next button when showing answer */}
            {showAnswer && (
              <Button
                className="w-full py-3 mb-6"
                onClick={() => {
                  if (currentQuestionIndex === questions.length - 1) {
                    finishQuiz();
                  } else {
                    goToNextQuestion();
                  }
                }}
              >
                {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
              </Button>
            )}
            
            {/* Only show back button if not showing answer */}
            {!showAnswer && (
              <Button
                variant="ghost"
                className="text-primary-500 font-medium w-full py-2 hover:text-primary-600 flex items-center justify-center"
                onClick={resetQuiz}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Categories
              </Button>
            )}
          </>
        )}
        
        {/* Quiz Results */}
        {quizState === QuizState.QUIZ_RESULTS && selectedCategory && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 mb-4">
                {quizData.correctCount > questions.length / 2 ? (
                  <Award className="h-10 w-10" />
                ) : (
                  <CheckCircle className="h-10 w-10" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {quizData.correctCount >= questions.length ? "Perfect!" : 
                 quizData.correctCount >= questions.length * 0.7 ? "Great job!" : 
                 quizData.correctCount >= questions.length * 0.5 ? "Well done!" : "Good effort!"}
              </h2>
              
              <p className="text-gray-600 mb-2">
                You scored {quizData.correctCount} out of {questions.length}
              </p>
              
              {/* Add a streak bonus if applicable */}
              {quizData.streak >= 3 && (
                <p className="text-green-600 text-sm font-medium mb-4">
                  +{Math.floor(quizData.streak/3)} point streak bonus!
                </p>
              )}
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-primary-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(quizData.correctCount / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-left mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Performance breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0 mr-3">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Correct answers</p>
                      <p className="text-xs text-gray-500">{quizData.correctCount} questions</p>
                    </div>
                  </div>
                  
                  {quizData.wrongCount > 0 && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mr-3">
                        <XCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Incorrect answers</p>
                        <p className="text-xs text-gray-500">{quizData.wrongCount} questions</p>
                      </div>
                    </div>
                  )}
                  
                  {quizData.skippedCount > 0 && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 mr-3">
                        <Timer className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Skipped (time ran out)</p>
                        <p className="text-xs text-gray-500">{quizData.skippedCount} questions</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 mb-6">
                <Button
                  className="flex-1 py-3"
                  onClick={tryAgain}
                  variant="outline"
                >
                  Review Answers
                </Button>
                
                <Button
                  className="flex-1 py-3"
                  onClick={tryAgain}
                >
                  Try Again
                </Button>
              </div>
              
              <Button
                variant="ghost"
                className="text-primary-500 font-medium w-full py-2 hover:text-primary-600"
                onClick={resetQuiz}
              >
                Back to Categories
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
