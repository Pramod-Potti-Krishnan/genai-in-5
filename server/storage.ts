import {
  users, topics, audibles, flashcards, quizQuestions, 
  userProgress, userFlashcards, userQuizScores, userStreaks, 
  userAchievements, storageObjects,
  type User, type InsertUser,
  type Topic, type InsertTopic,
  type Audible, type InsertAudible,
  type Flashcard, type InsertFlashcard,
  type QuizQuestion, type InsertQuizQuestion,
  type UserProgress, type InsertUserProgress,
  type UserFlashcard, type InsertUserFlashcard,
  type UserQuizScore, type InsertUserQuizScore,
  type UserStreak, type InsertUserStreak,
  type UserAchievement, type InsertUserAchievement,
  type StorageObject, type InsertStorageObject
} from "@shared/schema";
import { db } from "./db";
import { desc, eq, count, and, sql, lt, gt, gte, lte, or, SQL, between, not } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: number, data: Partial<InsertTopic>): Promise<Topic | undefined>;
  deleteTopic(id: number): Promise<boolean>;
  
  // Audible methods
  getAudibles(topicId?: number): Promise<Audible[]>;
  getAudible(id: number): Promise<Audible | undefined>;
  createAudible(audible: InsertAudible): Promise<Audible>;
  updateAudible(id: number, data: Partial<InsertAudible>): Promise<Audible | undefined>;
  deleteAudible(id: number): Promise<boolean>;
  
  // Flashcard methods
  getFlashcards(topicId?: number): Promise<Flashcard[]>;
  getFlashcard(id: number): Promise<Flashcard | undefined>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, data: Partial<InsertFlashcard>): Promise<Flashcard | undefined>;
  deleteFlashcard(id: number): Promise<boolean>;
  
  // Quiz Question methods
  getQuizQuestions(topicId?: number): Promise<QuizQuestion[]>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined>;
  deleteQuizQuestion(id: number): Promise<boolean>;
  
  // User Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getAudibleProgress(userId: number, audibleId: number): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // User Flashcard methods
  getUserFlashcards(userId: number): Promise<UserFlashcard[]>;
  reviewFlashcard(userId: number, cardId: number): Promise<UserFlashcard>;
  
  // User Quiz Score methods
  getUserQuizScores(userId: number): Promise<UserQuizScore[]>;
  saveQuizScore(score: InsertUserQuizScore): Promise<UserQuizScore>;
  
  // User Streak methods
  getUserStreak(userId: number): Promise<UserStreak | undefined>;
  updateStreak(userId: number): Promise<UserStreak>;
  
  // Storage Object methods
  createStorageObject(object: InsertStorageObject): Promise<StorageObject>;
  getStorageObject(id: number): Promise<StorageObject | undefined>;
  getStorageObjectByPath(bucket: string, path: string): Promise<StorageObject | undefined>;
  
  // Aggregation methods
  getUserStats(userId: number): Promise<any>;
  getLeaderboard(limit?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // ===== User Methods =====
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Initialize streaks record for new user
    await db.insert(userStreaks).values({
      userId: user.id,
      currentStreak: 0,
      longestStreak: 0
    });
    
    // Initialize achievements record
    await db.insert(userAchievements).values({
      userId: user.id,
      totalXp: 0,
      level: 1
    });
    
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // ===== Topic Methods =====
  async getTopics(): Promise<Topic[]> {
    return db.select().from(topics).orderBy(topics.title);
  }
  
  async getTopic(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  }
  
  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db
      .insert(topics)
      .values(insertTopic)
      .returning();
    return topic;
  }
  
  async updateTopic(id: number, data: Partial<InsertTopic>): Promise<Topic | undefined> {
    const [topic] = await db
      .update(topics)
      .set(data)
      .where(eq(topics.id, id))
      .returning();
    return topic;
  }
  
  async deleteTopic(id: number): Promise<boolean> {
    try {
      await db.delete(topics).where(eq(topics.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting topic:", error);
      return false;
    }
  }
  
  // ===== Audible Methods =====
  async getAudibles(topicId?: number): Promise<Audible[]> {
    if (topicId) {
      return db
        .select()
        .from(audibles)
        .where(eq(audibles.topicId, topicId))
        .orderBy(audibles.title);
    }
    return db.select().from(audibles).orderBy(audibles.title);
  }
  
  async getAudible(id: number): Promise<Audible | undefined> {
    const [audible] = await db.select().from(audibles).where(eq(audibles.id, id));
    return audible;
  }
  
  async createAudible(insertAudible: InsertAudible): Promise<Audible> {
    const [audible] = await db
      .insert(audibles)
      .values(insertAudible)
      .returning();
    return audible;
  }
  
  async updateAudible(id: number, data: Partial<InsertAudible>): Promise<Audible | undefined> {
    const [audible] = await db
      .update(audibles)
      .set(data)
      .where(eq(audibles.id, id))
      .returning();
    return audible;
  }
  
  async deleteAudible(id: number): Promise<boolean> {
    try {
      await db.delete(audibles).where(eq(audibles.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting audible:", error);
      return false;
    }
  }
  
  // ===== Flashcard Methods =====
  async getFlashcards(topicId?: number): Promise<Flashcard[]> {
    if (topicId) {
      return db
        .select()
        .from(flashcards)
        .where(eq(flashcards.topicId, topicId));
    }
    return db.select().from(flashcards);
  }
  
  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return flashcard;
  }
  
  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const [flashcard] = await db
      .insert(flashcards)
      .values(insertFlashcard)
      .returning();
    return flashcard;
  }
  
  async updateFlashcard(id: number, data: Partial<InsertFlashcard>): Promise<Flashcard | undefined> {
    const [flashcard] = await db
      .update(flashcards)
      .set(data)
      .where(eq(flashcards.id, id))
      .returning();
    return flashcard;
  }
  
  async deleteFlashcard(id: number): Promise<boolean> {
    try {
      await db.delete(flashcards).where(eq(flashcards.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      return false;
    }
  }
  
  // ===== Quiz Question Methods =====
  async getQuizQuestions(topicId?: number): Promise<QuizQuestion[]> {
    if (topicId) {
      return db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.topicId, topicId));
    }
    return db.select().from(quizQuestions);
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const [question] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, id));
    return question;
  }
  
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }
  
  async updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined> {
    const [question] = await db
      .update(quizQuestions)
      .set(data)
      .where(eq(quizQuestions.id, id))
      .returning();
    return question;
  }
  
  async deleteQuizQuestion(id: number): Promise<boolean> {
    try {
      await db.delete(quizQuestions).where(eq(quizQuestions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      return false;
    }
  }
  
  // ===== User Progress Methods =====
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }
  
  async getAudibleProgress(userId: number, audibleId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.audibleId, audibleId)
        )
      );
    return progress;
  }
  
  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress record exists
    const existingProgress = await this.getAudibleProgress(
      insertProgress.userId,
      insertProgress.audibleId
    );
    
    // Update existing record if it exists
    if (existingProgress) {
      const [progress] = await db
        .update(userProgress)
        .set(insertProgress)
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      
      // Update streak if completed
      if (insertProgress.isCompleted && !existingProgress.isCompleted) {
        await this.updateStreak(insertProgress.userId);
      }
      
      return progress;
    }
    
    // Create new record
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    
    // Update streak if completed
    if (insertProgress.isCompleted) {
      await this.updateStreak(insertProgress.userId);
    }
    
    return progress;
  }
  
  // ===== User Flashcard Methods =====
  async getUserFlashcards(userId: number): Promise<UserFlashcard[]> {
    return db
      .select()
      .from(userFlashcards)
      .where(eq(userFlashcards.userId, userId));
  }
  
  async reviewFlashcard(userId: number, cardId: number): Promise<UserFlashcard> {
    // Check if review record exists
    const [existingReview] = await db
      .select()
      .from(userFlashcards)
      .where(
        and(
          eq(userFlashcards.userId, userId),
          eq(userFlashcards.cardId, cardId)
        )
      );
    
    // Update existing record if it exists
    if (existingReview) {
      const [review] = await db
        .update(userFlashcards)
        .set({ reviewedAt: new Date() })
        .where(eq(userFlashcards.id, existingReview.id))
        .returning();
      
      // Update streak
      await this.updateStreak(userId);
      
      return review;
    }
    
    // Create new record
    const [review] = await db
      .insert(userFlashcards)
      .values({
        userId,
        cardId,
        reviewedAt: new Date()
      })
      .returning();
    
    // Update streak
    await this.updateStreak(userId);
    
    return review;
  }
  
  // ===== User Quiz Score Methods =====
  async getUserQuizScores(userId: number): Promise<UserQuizScore[]> {
    return db
      .select()
      .from(userQuizScores)
      .where(eq(userQuizScores.userId, userId));
  }
  
  async saveQuizScore(insertScore: InsertUserQuizScore): Promise<UserQuizScore> {
    const [score] = await db
      .insert(userQuizScores)
      .values(insertScore)
      .returning();
    
    // Update streak
    await this.updateStreak(insertScore.userId);
    
    // Update achievements/XP
    await this.updateUserAchievements(insertScore.userId, 
      Math.floor((insertScore.score / insertScore.total) * 100));
    
    return score;
  }
  
  // ===== User Streak Methods =====
  async getUserStreak(userId: number): Promise<UserStreak | undefined> {
    const [streak] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId));
    return streak;
  }
  
  async updateStreak(userId: number): Promise<UserStreak> {
    // Get current streak data
    const streak = await this.getUserStreak(userId);
    
    if (!streak) {
      // Create new streak record if none exists
      const [newStreak] = await db
        .insert(userStreaks)
        .values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date()
        })
        .returning();
      return newStreak;
    }
    
    // Get the date difference in days
    const lastActivity = new Date(streak.lastActivityDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate new streak
    let currentStreak = streak.currentStreak;
    
    // If activity happened today, no change to streak
    if (diffDays === 0) {
      return streak; 
    }
    
    // If activity was yesterday, increment streak
    if (diffDays === 1) {
      currentStreak += 1;
    } else {
      // More than 1 day passed, reset streak
      currentStreak = 1;
    }
    
    // Update longest streak if current is higher
    const longestStreak = Math.max(currentStreak, streak.longestStreak);
    
    // Update streak record
    const [updatedStreak] = await db
      .update(userStreaks)
      .set({
        currentStreak,
        longestStreak,
        lastActivityDate: today,
        updatedAt: today
      })
      .where(eq(userStreaks.id, streak.id))
      .returning();
    
    return updatedStreak;
  }
  
  // ===== Storage Object Methods =====
  async createStorageObject(insertObject: InsertStorageObject): Promise<StorageObject> {
    const [object] = await db
      .insert(storageObjects)
      .values(insertObject)
      .returning();
    return object;
  }
  
  async getStorageObject(id: number): Promise<StorageObject | undefined> {
    const [object] = await db
      .select()
      .from(storageObjects)
      .where(eq(storageObjects.id, id));
    return object;
  }
  
  async getStorageObjectByPath(bucket: string, path: string): Promise<StorageObject | undefined> {
    const [object] = await db
      .select()
      .from(storageObjects)
      .where(
        and(
          eq(storageObjects.bucket, bucket),
          eq(storageObjects.path, path)
        )
      );
    return object;
  }
  
  // ===== Private Helper Methods =====
  private async updateUserAchievements(userId: number, xpToAdd: number): Promise<void> {
    // Get current achievements
    const [achievement] = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    
    if (!achievement) {
      // Create new achievements record
      await db.insert(userAchievements).values({
        userId,
        totalXp: xpToAdd,
        level: this.calculateLevel(xpToAdd)
      });
      return;
    }
    
    // Update achievements
    const newXp = achievement.totalXp + xpToAdd;
    const newLevel = this.calculateLevel(newXp);
    
    // Update achievement record
    await db
      .update(userAchievements)
      .set({
        totalXp: newXp,
        level: newLevel,
        updatedAt: new Date()
      })
      .where(eq(userAchievements.id, achievement.id));
  }
  
  private calculateLevel(xp: number): number {
    // Simple level calculation: level = 1 + floor(xp / 1000)
    return 1 + Math.floor(xp / 1000);
  }
  
  // ===== Aggregation Methods =====
  async getUserStats(userId: number): Promise<any> {
    // Get total audibles completed
    const [audiblesCompleted] = await db
      .select({ count: count() })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.isCompleted, true)
        )
      );
    
    // Get total flashcards reviewed
    const [flashcardsReviewed] = await db
      .select({ count: count() })
      .from(userFlashcards)
      .where(eq(userFlashcards.userId, userId));
    
    // Get quiz performance
    const quizScores = await db
      .select({
        totalScore: sql<number>`sum(${userQuizScores.score})`,
        totalPossible: sql<number>`sum(${userQuizScores.total})`,
        quizzesTaken: count()
      })
      .from(userQuizScores)
      .where(eq(userQuizScores.userId, userId));
    
    // Get streak info
    const streak = await this.getUserStreak(userId);
    
    // Get achievements
    const [achievements] = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    
    return {
      audiblesCompleted: audiblesCompleted?.count || 0,
      flashcardsReviewed: flashcardsReviewed?.count || 0,
      quizPerformance: {
        totalScore: quizScores[0]?.totalScore || 0,
        totalPossible: quizScores[0]?.totalPossible || 0,
        quizzesTaken: quizScores[0]?.quizzesTaken || 0,
        averageScore: quizScores[0]?.totalPossible 
          ? Math.round((quizScores[0].totalScore / quizScores[0].totalPossible) * 100) 
          : 0
      },
      streak: {
        current: streak?.currentStreak || 0,
        longest: streak?.longestStreak || 0,
        lastActivity: streak?.lastActivityDate
      },
      xp: achievements?.totalXp || 0,
      level: achievements?.level || 1,
      badges: achievements?.badges || []
    };
  }
  
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    // Get top users by XP
    const leaderboardByXp = await db
      .select({
        userId: userAchievements.userId,
        name: users.name,
        avatarUrl: users.avatarUrl,
        xp: userAchievements.totalXp,
        level: userAchievements.level
      })
      .from(userAchievements)
      .innerJoin(users, eq(userAchievements.userId, users.id))
      .orderBy(desc(userAchievements.totalXp))
      .limit(limit);
    
    // Get top users by streak
    const leaderboardByStreak = await db
      .select({
        userId: userStreaks.userId,
        name: users.name,
        avatarUrl: users.avatarUrl,
        currentStreak: userStreaks.currentStreak,
        longestStreak: userStreaks.longestStreak
      })
      .from(userStreaks)
      .innerJoin(users, eq(userStreaks.userId, users.id))
      .orderBy(desc(userStreaks.currentStreak))
      .limit(limit);
    
    return {
      byXp: leaderboardByXp,
      byStreak: leaderboardByStreak
    };
  }
  
  // Method required by IStorage from auth.ts
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.getUserByEmail(username);
  }
}

export const storage = new DatabaseStorage();
