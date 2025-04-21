import { useState } from "react";
import { useAppContext } from "@/app-context";
import { getTriviaQuestions } from "@/lib/mock-data";
import { TriviaQuestion, TriviaCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizOption from "@/components/quiz/QuizOption";
import { CheckCircle, XCircle, Lightbulb, Edit, ShieldCheck, FlaskRound, ChevronLeft, Star } from "lucide-react";

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

export default function Trivia() {
  const { triviaCategories, progress, saveTriviaScore } = useAppContext();
  
  const [quizState, setQuizState] = useState<QuizState>(QuizState.CATEGORY_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<TriviaCategory | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  
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
    setScore(0);
    setQuizState(QuizState.QUIZ_INTERFACE);
  };
  
  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  // Move to the next question or end the quiz
  const goToNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Finish the quiz and calculate score
  const finishQuiz = () => {
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    
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
    setScore(0);
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
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">{selectedCategory.title} Quiz</h2>
                  <span className="text-sm text-gray-600">
                    Question <span>{currentQuestionIndex + 1}</span>/{questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
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
                      onSelect={handleSelectOption}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Button
              className="w-full py-3 mb-6"
              onClick={goToNextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit Quiz" : "Next Question"}
            </Button>
            
            <Button
              variant="ghost"
              className="text-primary-500 font-medium w-full py-2 hover:text-primary-600 flex items-center justify-center"
              onClick={resetQuiz}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </Button>
          </>
        )}
        
        {/* Quiz Results */}
        {quizState === QuizState.QUIZ_RESULTS && selectedCategory && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Great job!</h2>
              <p className="text-gray-600 mb-4">
                You scored {score} out of {questions.length}
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-primary-500 h-2.5 rounded-full"
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-left mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Performance breakdown</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0 mr-3">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Correct answers</p>
                      <p className="text-xs text-gray-500">{score} questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mr-3">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Incorrect answers</p>
                      <p className="text-xs text-gray-500">{questions.length - score} questions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full py-3 mb-3"
                onClick={tryAgain}
              >
                Try Again
              </Button>
              
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
