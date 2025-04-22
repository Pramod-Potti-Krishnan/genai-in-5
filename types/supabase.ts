export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          username: string | null
          password: string
          firstName: string | null
          lastName: string | null
          avatarUrl: string | null
          isAdmin: boolean | null
          createdAt: string
          xp: number | null
          level: number | null
          googleId: string | null
          facebookId: string | null
        }
        Insert: {
          id?: number
          email: string
          username?: string | null
          password: string
          firstName?: string | null
          lastName?: string | null
          avatarUrl?: string | null
          isAdmin?: boolean | null
          createdAt?: string
          xp?: number | null
          level?: number | null
          googleId?: string | null
          facebookId?: string | null
        }
        Update: {
          id?: number
          email?: string
          username?: string | null
          password?: string
          firstName?: string | null
          lastName?: string | null
          avatarUrl?: string | null
          isAdmin?: boolean | null
          createdAt?: string
          xp?: number | null
          level?: number | null
          googleId?: string | null
          facebookId?: string | null
        }
      }
      topics: {
        Row: {
          id: number
          title: string
          description: string | null
          icon: string | null
          createdAt: string
          order: number | null
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          icon?: string | null
          createdAt?: string
          order?: number | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          icon?: string | null
          createdAt?: string
          order?: number | null
        }
      }
      audibles: {
        Row: {
          id: number
          title: string
          summary: string | null
          audio: string
          duration: number
          coverImage: string | null
          topicId: number
          createdAt: string
          updatedAt: string | null
          transcript: string | null
        }
        Insert: {
          id?: number
          title: string
          summary?: string | null
          audio: string
          duration: number
          coverImage?: string | null
          topicId: number
          createdAt?: string
          updatedAt?: string | null
          transcript?: string | null
        }
        Update: {
          id?: number
          title?: string
          summary?: string | null
          audio?: string
          duration?: number
          coverImage?: string | null
          topicId?: number
          createdAt?: string
          updatedAt?: string | null
          transcript?: string | null
        }
      }
      flashcards: {
        Row: {
          id: number
          question: string
          answer: string
          topicId: number
          createdAt: string
          image: string | null
        }
        Insert: {
          id?: number
          question: string
          answer: string
          topicId: number
          createdAt?: string
          image?: string | null
        }
        Update: {
          id?: number
          question?: string
          answer?: string
          topicId?: number
          createdAt?: string
          image?: string | null
        }
      }
      quiz_questions: {
        Row: {
          id: number
          question: string
          options: string[]
          correctOption: number
          topicId: number
          createdAt: string
          explanation: string | null
        }
        Insert: {
          id?: number
          question: string
          options: string[]
          correctOption: number
          topicId: number
          createdAt?: string
          explanation?: string | null
        }
        Update: {
          id?: number
          question?: string
          options?: string[]
          correctOption?: number
          topicId?: number
          createdAt?: string
          explanation?: string | null
        }
      }
      user_progress: {
        Row: {
          id: number
          userId: number
          audibleId: number
          completed: boolean
          progress: number
          createdAt: string
          lastAccessed: string | null
        }
        Insert: {
          id?: number
          userId: number
          audibleId: number
          completed: boolean
          progress: number
          createdAt?: string
          lastAccessed?: string | null
        }
        Update: {
          id?: number
          userId?: number
          audibleId?: number
          completed?: boolean
          progress?: number
          createdAt?: string
          lastAccessed?: string | null
        }
      }
      user_flashcards: {
        Row: {
          id: number
          userId: number
          flashcardId: number
          lastReviewed: string
          nextReviewDue: string | null
          createdAt: string
          easeFactor: number | null
          intervalDays: number | null
        }
        Insert: {
          id?: number
          userId: number
          flashcardId: number
          lastReviewed: string
          nextReviewDue?: string | null
          createdAt?: string
          easeFactor?: number | null
          intervalDays?: number | null
        }
        Update: {
          id?: number
          userId?: number
          flashcardId?: number
          lastReviewed?: string
          nextReviewDue?: string | null
          createdAt?: string
          easeFactor?: number | null
          intervalDays?: number | null
        }
      }
      user_quiz_scores: {
        Row: {
          id: number
          userId: number
          topicId: number
          score: number
          totalQuestions: number
          createdAt: string
        }
        Insert: {
          id?: number
          userId: number
          topicId: number
          score: number
          totalQuestions: number
          createdAt?: string
        }
        Update: {
          id?: number
          userId?: number
          topicId?: number
          score?: number
          totalQuestions?: number
          createdAt?: string
        }
      }
      user_streaks: {
        Row: {
          id: number
          userId: number
          currentStreak: number
          longestStreak: number
          lastActivityDate: string
          updatedAt: string
        }
        Insert: {
          id?: number
          userId: number
          currentStreak: number
          longestStreak: number
          lastActivityDate: string
          updatedAt?: string
        }
        Update: {
          id?: number
          userId?: number
          currentStreak?: number
          longestStreak?: number
          lastActivityDate?: string
          updatedAt?: string
        }
      }
      user_achievements: {
        Row: {
          id: number
          userId: number
          type: string
          title: string
          description: string
          icon: string | null
          unlockedAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: number
          userId: number
          type: string
          title: string
          description: string
          icon?: string | null
          unlockedAt: string
          updatedAt?: string | null
        }
        Update: {
          id?: number
          userId?: number
          type?: string
          title?: string
          description?: string
          icon?: string | null
          unlockedAt?: string
          updatedAt?: string | null
        }
      }
      storage_objects: {
        Row: {
          id: number
          bucket: string
          path: string
          filename: string
          contentType: string
          size: number
          uploadedAt: string
          metadata: Json | null
        }
        Insert: {
          id?: number
          bucket: string
          path: string
          filename: string
          contentType: string
          size: number
          uploadedAt?: string
          metadata?: Json | null
        }
        Update: {
          id?: number
          bucket?: string
          path?: string
          filename?: string
          contentType?: string
          size?: number
          uploadedAt?: string
          metadata?: Json | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}