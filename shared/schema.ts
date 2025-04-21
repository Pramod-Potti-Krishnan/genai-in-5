import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const audibles = pgTable("audibles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  coverImage: text("cover_image"),
  durationInSeconds: integer("duration_in_seconds").notNull(),
  sectionId: integer("section_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  audibleId: integer("audible_id").notNull(),
  points: text("points").array().notNull(),
  lineIllustration: text("line_illustration"),
  title: text("title"),
  sectionId: integer("section_id"),
  difficulty: text("difficulty"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const triviaCategories = pgTable("trivia_categories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon"),
  iconBgColor: text("icon_bg_color"),
  iconTextColor: text("icon_text_color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const triviaQuestions = pgTable("trivia_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctOptionIndex: integer("correct_option_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  audibleId: integer("audible_id").notNull(),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRevisions = pgTable("user_revisions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  flashcardId: integer("flashcard_id").notNull(),
  reviewed: boolean("reviewed").default(false),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userTrivia = pgTable("user_trivia", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true, createdAt: true });
export const insertAudibleSchema = createInsertSchema(audibles).omit({ id: true, createdAt: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true, createdAt: true });
export const insertTriviaCategorySchema = createInsertSchema(triviaCategories).omit({ id: true, createdAt: true });
export const insertTriviaQuestionSchema = createInsertSchema(triviaQuestions).omit({ id: true, createdAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserRevisionSchema = createInsertSchema(userRevisions).omit({ id: true, createdAt: true });
export const insertUserTriviaSchema = createInsertSchema(userTrivia).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;

export type Audible = typeof audibles.$inferSelect;
export type InsertAudible = z.infer<typeof insertAudibleSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type TriviaCategory = typeof triviaCategories.$inferSelect;
export type InsertTriviaCategory = z.infer<typeof insertTriviaCategorySchema>;

export type TriviaQuestion = typeof triviaQuestions.$inferSelect;
export type InsertTriviaQuestion = z.infer<typeof insertTriviaQuestionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type UserRevision = typeof userRevisions.$inferSelect;
export type InsertUserRevision = z.infer<typeof insertUserRevisionSchema>;

export type UserTrivia = typeof userTrivia.$inferSelect;
export type InsertUserTrivia = z.infer<typeof insertUserTriviaSchema>;
