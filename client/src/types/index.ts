export interface User {
  id: string;
  name: string;
  email: string;
}

// This interface extends and adapts database model for client-side use
export interface Audible {
  id: number;  // Database uses serial (number) primary keys
  title: string;
  description: string;  // From database
  summary?: string;     // For client-side display
  audioUrl: string;
  coverImage: string | null;
  durationInSeconds: number;  // From database
  duration?: number;          // Alias for durationInSeconds for compatibility
  sectionId: number;          // Database uses integer foreign keys
  createdAt?: Date | null;
}

export interface Section {
  id: number;             // Database uses serial (number) primary keys
  title: string;
  icon: string | null;
  color?: string;         // Client-side property
  createdAt?: Date | null;
  audibles?: Audible[];   // For client-side relationships
}

export interface Flashcard {
  id: string;
  audibleId: string;
  sectionTitle: string;
  audibleTitle: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  keyPoints: string[];
  lastReviewed?: Date;
}

export interface TriviaCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  questionCount: number;
}

export interface TriviaQuestion {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TriviaScore {
  categoryId: string;
  score: number;
}

export interface TriviaQuiz {
  categoryId: string;
  questions: TriviaQuestion[];
}
