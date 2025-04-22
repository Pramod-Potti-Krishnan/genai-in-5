import { 
  User, Topic, Audible, Flashcard, QuizQuestion, 
  UserProgress, UserFlashcard, UserQuizScore, UserStreak, 
  UserAchievement, StorageObject, InsertUser, InsertTopic, 
  InsertAudible, InsertFlashcard, InsertQuizQuestion, 
  InsertUserProgress, InsertUserFlashcard, InsertUserQuizScore, 
  InsertUserStreak, InsertUserAchievement, InsertStorageObject 
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { supabase } from "./supabase-client";
import { IStorage } from "./storage";
import { createClient } from "@supabase/supabase-js";

const PostgresSessionStore = connectPg(session);

export class SupabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.SUPABASE_DATABASE_URL,
      createTableIfMissing: true,
      ssl: { rejectUnauthorized: false }
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
      
    if (error || !data) return [];
    return data as User[];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([insertUser])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating user: ${error?.message}`);
    return data as User;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const { data: updatedData, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !updatedData) return undefined;
    return updatedData as User;
  }
  
  // Topic methods
  async getTopics(): Promise<Topic[]> {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('order', { ascending: true });
      
    if (error || !data) return [];
    return data as Topic[];
  }
  
  async getTopic(id: number): Promise<Topic | undefined> {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as Topic;
  }
  
  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const { data, error } = await supabase
      .from('topics')
      .insert([insertTopic])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating topic: ${error?.message}`);
    return data as Topic;
  }
  
  async updateTopic(id: number, data: Partial<InsertTopic>): Promise<Topic | undefined> {
    const { data: updatedData, error } = await supabase
      .from('topics')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !updatedData) return undefined;
    return updatedData as Topic;
  }
  
  async deleteTopic(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);
      
    return !error;
  }
  
  // Audible methods
  async getAudibles(topicId?: number): Promise<Audible[]> {
    let query = supabase
      .from('audibles')
      .select('*');
      
    if (topicId) {
      query = query.eq('topicId', topicId);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    return data as Audible[];
  }
  
  async getAudible(id: number): Promise<Audible | undefined> {
    const { data, error } = await supabase
      .from('audibles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as Audible;
  }
  
  async createAudible(insertAudible: InsertAudible): Promise<Audible> {
    const { data, error } = await supabase
      .from('audibles')
      .insert([insertAudible])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating audible: ${error?.message}`);
    return data as Audible;
  }
  
  async updateAudible(id: number, data: Partial<InsertAudible>): Promise<Audible | undefined> {
    const { data: updatedData, error } = await supabase
      .from('audibles')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !updatedData) return undefined;
    return updatedData as Audible;
  }
  
  async deleteAudible(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('audibles')
      .delete()
      .eq('id', id);
      
    return !error;
  }
  
  // Flashcard methods
  async getFlashcards(topicId?: number): Promise<Flashcard[]> {
    let query = supabase
      .from('flashcards')
      .select('*');
      
    if (topicId) {
      query = query.eq('topicId', topicId);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    return data as Flashcard[];
  }
  
  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as Flashcard;
  }
  
  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([insertFlashcard])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating flashcard: ${error?.message}`);
    return data as Flashcard;
  }
  
  async updateFlashcard(id: number, data: Partial<InsertFlashcard>): Promise<Flashcard | undefined> {
    const { data: updatedData, error } = await supabase
      .from('flashcards')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !updatedData) return undefined;
    return updatedData as Flashcard;
  }
  
  async deleteFlashcard(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
      
    return !error;
  }
  
  // Quiz Question methods
  async getQuizQuestions(topicId?: number): Promise<QuizQuestion[]> {
    let query = supabase
      .from('quiz_questions')
      .select('*');
      
    if (topicId) {
      query = query.eq('topicId', topicId);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    return data as QuizQuestion[];
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as QuizQuestion;
  }
  
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([insertQuestion])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating quiz question: ${error?.message}`);
    return data as QuizQuestion;
  }
  
  async updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined> {
    const { data: updatedData, error } = await supabase
      .from('quiz_questions')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !updatedData) return undefined;
    return updatedData as QuizQuestion;
  }
  
  async deleteQuizQuestion(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);
      
    return !error;
  }
  
  // User Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('userId', userId);
      
    if (error || !data) return [];
    return data as UserProgress[];
  }
  
  async getAudibleProgress(userId: number, audibleId: number): Promise<UserProgress | undefined> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('userId', userId)
      .eq('audibleId', audibleId)
      .single();
      
    if (error || !data) return undefined;
    return data as UserProgress;
  }
  
  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress already exists
    const existingProgress = await this.getAudibleProgress(
      insertProgress.userId, 
      insertProgress.audibleId
    );
    
    if (existingProgress) {
      // Update existing
      const { data, error } = await supabase
        .from('user_progress')
        .update(insertProgress)
        .eq('id', existingProgress.id)
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error updating progress: ${error?.message}`);
      return data as UserProgress;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('user_progress')
        .insert([insertProgress])
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error creating progress: ${error?.message}`);
      return data as UserProgress;
    }
  }
  
  // User Flashcard methods
  async getUserFlashcards(userId: number): Promise<UserFlashcard[]> {
    const { data, error } = await supabase
      .from('user_flashcards')
      .select('*')
      .eq('userId', userId);
      
    if (error || !data) return [];
    return data as UserFlashcard[];
  }
  
  async reviewFlashcard(userId: number, cardId: number): Promise<UserFlashcard> {
    const now = new Date().toISOString();
    
    // Check if user flashcard record exists
    const { data: existingData, error: existingError } = await supabase
      .from('user_flashcards')
      .select('*')
      .eq('userId', userId)
      .eq('flashcardId', cardId)
      .single();
      
    if (existingData) {
      // Update existing
      const { data, error } = await supabase
        .from('user_flashcards')
        .update({ 
          lastReviewed: now,
          // Next review calculation can be added here
        })
        .eq('id', existingData.id)
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error updating flashcard review: ${error?.message}`);
      return data as UserFlashcard;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('user_flashcards')
        .insert([{
          userId,
          flashcardId: cardId,
          lastReviewed: now
        }])
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error creating flashcard review: ${error?.message}`);
      return data as UserFlashcard;
    }
  }
  
  // User Quiz Score methods
  async getUserQuizScores(userId: number): Promise<UserQuizScore[]> {
    const { data, error } = await supabase
      .from('user_quiz_scores')
      .select('*')
      .eq('userId', userId);
      
    if (error || !data) return [];
    return data as UserQuizScore[];
  }
  
  async saveQuizScore(insertScore: InsertUserQuizScore): Promise<UserQuizScore> {
    const { data, error } = await supabase
      .from('user_quiz_scores')
      .insert([insertScore])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error saving quiz score: ${error?.message}`);
    
    // Update user streak after saving a quiz score
    await this.updateStreak(insertScore.userId);
    
    // Update achievements
    const xpToAdd = Math.round((insertScore.score / insertScore.totalQuestions) * 10);
    await this.updateUserAchievements(insertScore.userId, xpToAdd);
    
    return data as UserQuizScore;
  }
  
  // User Streak methods
  async getUserStreak(userId: number): Promise<UserStreak | undefined> {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('userId', userId)
      .single();
      
    if (error || !data) return undefined;
    return data as UserStreak;
  }
  
  async updateStreak(userId: number): Promise<UserStreak> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    
    // Get existing streak
    const existingStreak = await this.getUserStreak(userId);
    
    if (existingStreak) {
      // Check if activity was already done today
      const lastActivity = new Date(existingStreak.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      
      if (lastActivity.getTime() === today.getTime()) {
        // Already updated today, no change needed
        return existingStreak;
      }
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let currentStreak = existingStreak.currentStreak;
      let longestStreak = existingStreak.longestStreak;
      
      if (lastActivity.getTime() === yesterday.getTime()) {
        // Activity on consecutive days, increment streak
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        // Streak broken, reset
        currentStreak = 1;
      }
      
      // Update streak
      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          currentStreak,
          longestStreak,
          lastActivityDate: todayStr,
          updatedAt: new Date().toISOString()
        })
        .eq('id', existingStreak.id)
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error updating streak: ${error?.message}`);
      return data as UserStreak;
    } else {
      // Create new streak
      const { data, error } = await supabase
        .from('user_streaks')
        .insert([{
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: todayStr,
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error || !data) throw new Error(`Error creating streak: ${error?.message}`);
      return data as UserStreak;
    }
  }
  
  // Storage Object methods
  async createStorageObject(insertObject: InsertStorageObject): Promise<StorageObject> {
    const { data, error } = await supabase
      .from('storage_objects')
      .insert([insertObject])
      .select()
      .single();
      
    if (error || !data) throw new Error(`Error creating storage object: ${error?.message}`);
    return data as StorageObject;
  }
  
  async getStorageObject(id: number): Promise<StorageObject | undefined> {
    const { data, error } = await supabase
      .from('storage_objects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as StorageObject;
  }
  
  async getStorageObjectByPath(bucket: string, path: string): Promise<StorageObject | undefined> {
    const { data, error } = await supabase
      .from('storage_objects')
      .select('*')
      .eq('bucket', bucket)
      .eq('path', path)
      .single();
      
    if (error || !data) return undefined;
    return data as StorageObject;
  }
  
  // Aggregation methods
  private async updateUserAchievements(userId: number, xpToAdd: number): Promise<void> {
    // Get user
    const user = await this.getUser(userId);
    if (!user) return;
    
    // Update XP
    const currentXp = user.xp || 0;
    const newXp = currentXp + xpToAdd;
    const currentLevel = user.level || 0;
    const newLevel = this.calculateLevel(newXp);
    
    // Update user XP and level
    await supabase
      .from('users')
      .update({
        xp: newXp,
        level: newLevel
      })
      .eq('id', userId);
      
    // If level up, create achievement
    if (newLevel > currentLevel) {
      await supabase
        .from('user_achievements')
        .insert([{
          userId,
          type: 'level_up',
          title: `Reached Level ${newLevel}`,
          description: `You've reached level ${newLevel}!`,
          icon: 'star',
          unlockedAt: new Date().toISOString()
        }]);
    }
  }
  
  private calculateLevel(xp: number): number {
    // Simple level calculation: level = sqrt(xp / 10)
    return Math.floor(Math.sqrt(xp / 10)) + 1;
  }
  
  async getUserStats(userId: number): Promise<any> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const progress = await this.getUserProgress(userId);
    const flashcards = await this.getUserFlashcards(userId);
    const quizScores = await this.getUserQuizScores(userId);
    const streak = await this.getUserStreak(userId) || { currentStreak: 0, longestStreak: 0 };
    
    // Get achievements
    const { data: achievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('userId', userId);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        level: user.level || 1,
        xp: user.xp || 0
      },
      stats: {
        audiblesCompleted: progress.filter(p => p.completed).length,
        audiblesInProgress: progress.filter(p => !p.completed).length,
        flashcardsReviewed: flashcards.length,
        quizzesTaken: quizScores.length,
        averageScore: quizScores.length > 0 
          ? quizScores.reduce((acc, score) => acc + (score.score / score.totalQuestions), 0) / quizScores.length 
          : 0,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak
      },
      achievements: achievements || []
    };
  }
  
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, firstName, lastName, avatarUrl, xp, level')
      .order('xp', { ascending: false })
      .limit(limit);
      
    if (error || !data) return [];
    
    return data.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }
}

// Export a singleton instance
export const supabaseStorage = new SupabaseStorage();