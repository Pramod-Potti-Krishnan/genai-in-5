import { pgTable, text, serial, integer, boolean, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  name: text("name").notNull(), // Keep for backward compatibility
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false),
  googleId: text("google_id").unique(), // For Google OAuth
  facebookId: text("facebook_id").unique(), // For Facebook OAuth
  createdAt: timestamp("created_at").defaultNow(),
});

// Topics (previously sections)
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon"),
  color: text("color"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audibles
export const audibles = pgTable("audibles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  audioUrl: text("audio_url").notNull(),
  lengthSec: integer("length_sec").notNull(),
  coverImage: text("cover_image"),
  topicId: integer("topic_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    topicIdIdx: index("audible_topic_id_idx").on(table.topicId),
  }
});

// Flashcards
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  headline: text("headline").notNull(),
  bullets: text("bullets").array(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    topicIdIdx: index("flashcard_topic_id_idx").on(table.topicId),
  }
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctIndex: integer("correct_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    topicIdIdx: index("question_topic_id_idx").on(table.topicId),
  }
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  audibleId: integer("audible_id").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userAudibleIdx: uniqueIndex("user_audible_idx").on(table.userId, table.audibleId),
    userIdIdx: index("progress_user_id_idx").on(table.userId),
  }
});

// User Flashcard Reviews
export const userFlashcards = pgTable("user_flashcards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userCardIdx: uniqueIndex("user_card_idx").on(table.userId, table.cardId),
    userIdIdx: index("flashcard_user_id_idx").on(table.userId),
  }
});

// User Quiz Scores
export const userQuizScores = pgTable("user_quiz_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topicId: integer("topic_id").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  takenAt: timestamp("taken_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userTopicIdx: index("user_topic_idx").on(table.userId, table.topicId),
    userIdIdx: index("quiz_user_id_idx").on(table.userId),
  }
});

// User Streaks
export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User XP/Badges (Optional)
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  badges: text("badges").array().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Storage objects
export const storageObjects = pgTable("storage_objects", {
  id: serial("id").primaryKey(),
  bucket: text("bucket").notNull(),
  path: text("path").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
  publicUrl: text("public_url"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
}, (table) => {
  return {
    bucketPathIdx: uniqueIndex("bucket_path_idx").on(table.bucket, table.path),
  }
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  flashcardReviews: many(userFlashcards),
  quizScores: many(userQuizScores),
  streak: many(userStreaks),
  achievements: many(userAchievements),
  uploads: many(storageObjects),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  audibles: many(audibles),
  flashcards: many(flashcards),
  quizQuestions: many(quizQuestions),
}));

export const audiblesRelations = relations(audibles, ({ one, many }) => ({
  topic: one(topics, {
    fields: [audibles.topicId],
    references: [topics.id],
  }),
  userProgress: many(userProgress),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  topic: one(topics, {
    fields: [flashcards.topicId],
    references: [topics.id],
  }),
  userReviews: many(userFlashcards),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  topic: one(topics, {
    fields: [quizQuestions.topicId],
    references: [topics.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  audible: one(audibles, {
    fields: [userProgress.audibleId],
    references: [audibles.id],
  }),
}));

export const userFlashcardsRelations = relations(userFlashcards, ({ one }) => ({
  user: one(users, {
    fields: [userFlashcards.userId],
    references: [users.id],
  }),
  flashcard: one(flashcards, {
    fields: [userFlashcards.cardId],
    references: [flashcards.id],
  }),
}));

export const userQuizScoresRelations = relations(userQuizScores, ({ one }) => ({
  user: one(users, {
    fields: [userQuizScores.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [userQuizScores.topicId],
    references: [topics.id],
  }),
}));

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true, createdAt: true });
export const insertAudibleSchema = createInsertSchema(audibles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true, createdAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true });
export const insertUserFlashcardSchema = createInsertSchema(userFlashcards).omit({ id: true, createdAt: true });
export const insertUserQuizScoreSchema = createInsertSchema(userQuizScores).omit({ id: true, createdAt: true });
export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({ id: true, updatedAt: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, updatedAt: true });
export const insertStorageObjectSchema = createInsertSchema(storageObjects).omit({ id: true, uploadedAt: true });

// TypeScript types based on the schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Audible = typeof audibles.$inferSelect;
export type InsertAudible = z.infer<typeof insertAudibleSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type UserFlashcard = typeof userFlashcards.$inferSelect;
export type InsertUserFlashcard = z.infer<typeof insertUserFlashcardSchema>;

export type UserQuizScore = typeof userQuizScores.$inferSelect;
export type InsertUserQuizScore = z.infer<typeof insertUserQuizScoreSchema>;

export type UserStreak = typeof userStreaks.$inferSelect;
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect; 
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type StorageObject = typeof storageObjects.$inferSelect;
export type InsertStorageObject = z.infer<typeof insertStorageObjectSchema>;
