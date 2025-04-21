import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Audible, TriviaCategory, TriviaScore, Section } from "./types";
import { getStoredUser, setStoredUser, getStoredProgress, setStoredProgress } from "./utils/local-storage";
import { mockSections, mockTriviaCategories } from "./lib/mock-data";

interface Progress {
  listenedAudibles: string[];
  reviewedFlashcards: string[];
  currentStreak: number;
  bestStreak: number;
  triviaScores: TriviaScore[];
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  sections: Section[];
  triviaCategories: TriviaCategory[];
  currentAudible: Audible | null;
  isPlaying: boolean;
  miniPlayerVisible: boolean;
  progress: Progress;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  playAudible: (audible: Audible) => void;
  pauseAudible: () => void;
  togglePlayPause: () => void;
  markAudibleComplete: (audibleId: string) => void;
  markFlashcardReviewed: (flashcardId: string) => void;
  saveTriviaScore: (categoryId: string, score: number) => void;
  getCompletionPercentage: () => number;
}

const defaultProgress: Progress = {
  listenedAudibles: [],
  reviewedFlashcards: [],
  currentStreak: 0,
  bestStreak: 0,
  triviaScores: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [sections] = useState<Section[]>(mockSections);
  const [triviaCategories] = useState<TriviaCategory[]>(mockTriviaCategories);
  const [currentAudible, setCurrentAudible] = useState<Audible | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>(getStoredProgress() || defaultProgress);

  // Update localStorage when user or progress changes
  useEffect(() => {
    if (user) {
      setStoredUser(user);
    }
  }, [user]);

  useEffect(() => {
    setStoredProgress(progress);
  }, [progress]);

  const login = (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    setUser({
      id: "1",
      name: "Alex",
      email,
    });
  };

  const register = (name: string, email: string, password: string) => {
    // Mock registration - in a real app, this would call an API
    setUser({
      id: "1",
      name,
      email,
    });
  };

  const logout = () => {
    setUser(null);
    setCurrentAudible(null);
    setIsPlaying(false);
    setMiniPlayerVisible(false);
  };

  const playAudible = (audible: Audible) => {
    setCurrentAudible(audible);
    setIsPlaying(true);
    setMiniPlayerVisible(true);
  };

  const pauseAudible = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const markAudibleComplete = (audibleId: string) => {
    if (!progress.listenedAudibles.includes(audibleId)) {
      setProgress({
        ...progress,
        listenedAudibles: [...progress.listenedAudibles, audibleId],
      });
    }
  };

  const markFlashcardReviewed = (flashcardId: string) => {
    // If not already marked as reviewed
    if (!progress.reviewedFlashcards.includes(flashcardId)) {
      setProgress({
        ...progress,
        reviewedFlashcards: [...progress.reviewedFlashcards, flashcardId],
        currentStreak: progress.currentStreak + 1,
        bestStreak: Math.max(progress.bestStreak, progress.currentStreak + 1),
      });
    }
  };

  const saveTriviaScore = (categoryId: string, score: number) => {
    // Find if there's an existing score for this category
    const existingScoreIndex = progress.triviaScores.findIndex(
      (item) => item.categoryId === categoryId
    );

    if (existingScoreIndex >= 0) {
      // Update existing score if new one is better
      const updatedScores = [...progress.triviaScores];
      if (score > updatedScores[existingScoreIndex].score) {
        updatedScores[existingScoreIndex] = { categoryId, score };
      }
      setProgress({ ...progress, triviaScores: updatedScores });
    } else {
      // Add new score
      setProgress({
        ...progress,
        triviaScores: [...progress.triviaScores, { categoryId, score }],
      });
    }
  };

  const getCompletionPercentage = () => {
    const totalAudibles = sections.reduce((sum, section) => sum + section.audibles.length, 0);
    const completedAudibles = progress.listenedAudibles.length;
    return Math.round((completedAudibles / totalAudibles) * 100) || 0;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    sections,
    triviaCategories,
    currentAudible,
    isPlaying,
    miniPlayerVisible,
    progress,
    login,
    register,
    logout,
    playAudible,
    pauseAudible,
    togglePlayPause,
    markAudibleComplete,
    markFlashcardReviewed,
    saveTriviaScore,
    getCompletionPercentage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
