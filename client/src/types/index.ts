export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Audible {
  id: string;
  title: string;
  summary: string;
  duration: number; // in seconds
  coverImage?: string;
  audioUrl: string;
  sectionId: string;
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  audibles: Audible[];
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
