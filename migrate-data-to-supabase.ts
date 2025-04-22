import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import ws from "ws";
import * as schema from "./shared/schema";

neonConfig.webSocketConstructor = ws;

async function migrateData() {
  console.log("🔄 Starting data migration to Supabase...");
  
  // Check environment variables
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for the source database");
  }
  
  if (!process.env.SUPABASE_DATABASE_URL) {
    throw new Error("SUPABASE_DATABASE_URL must be set for the target Supabase database");
  }
  
  // Create source connection (original database)
  const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sourceDb = drizzle(sourcePool, { schema });
  
  // Create target connection (Supabase)
  const targetPool = new pg.Pool({ 
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const targetDb = drizzlePg(targetPool, { schema });
  
  try {
    // Migrate users
    console.log("📋 Migrating users...");
    const users = await sourceDb.select().from(schema.users);
    if (users.length > 0) {
      for (const user of users) {
        await targetDb.insert(schema.users).values(user).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${users.length} users`);
    } else {
      console.log("ℹ️ No users to migrate");
    }
    
    // Migrate topics
    console.log("📋 Migrating topics...");
    const topics = await sourceDb.select().from(schema.topics);
    if (topics.length > 0) {
      for (const topic of topics) {
        await targetDb.insert(schema.topics).values(topic).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${topics.length} topics`);
    } else {
      console.log("ℹ️ No topics to migrate");
    }
    
    // Migrate audibles
    console.log("📋 Migrating audibles...");
    const audibles = await sourceDb.select().from(schema.audibles);
    if (audibles.length > 0) {
      for (const audible of audibles) {
        await targetDb.insert(schema.audibles).values(audible).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${audibles.length} audibles`);
    } else {
      console.log("ℹ️ No audibles to migrate");
    }
    
    // Migrate flashcards
    console.log("📋 Migrating flashcards...");
    const flashcards = await sourceDb.select().from(schema.flashcards);
    if (flashcards.length > 0) {
      for (const flashcard of flashcards) {
        await targetDb.insert(schema.flashcards).values(flashcard).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${flashcards.length} flashcards`);
    } else {
      console.log("ℹ️ No flashcards to migrate");
    }
    
    // Migrate quiz questions
    console.log("📋 Migrating quiz questions...");
    const quizQuestions = await sourceDb.select().from(schema.quizQuestions);
    if (quizQuestions.length > 0) {
      for (const quizQuestion of quizQuestions) {
        await targetDb.insert(schema.quizQuestions).values(quizQuestion).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${quizQuestions.length} quiz questions`);
    } else {
      console.log("ℹ️ No quiz questions to migrate");
    }
    
    // Migrate user progress
    console.log("📋 Migrating user progress...");
    const userProgress = await sourceDb.select().from(schema.userProgress);
    if (userProgress.length > 0) {
      for (const progress of userProgress) {
        await targetDb.insert(schema.userProgress).values(progress).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${userProgress.length} user progress records`);
    } else {
      console.log("ℹ️ No user progress to migrate");
    }
    
    // Migrate user flashcards
    console.log("📋 Migrating user flashcards...");
    const userFlashcards = await sourceDb.select().from(schema.userFlashcards);
    if (userFlashcards.length > 0) {
      for (const userFlashcard of userFlashcards) {
        await targetDb.insert(schema.userFlashcards).values(userFlashcard).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${userFlashcards.length} user flashcards`);
    } else {
      console.log("ℹ️ No user flashcards to migrate");
    }
    
    // Migrate user quiz scores
    console.log("📋 Migrating user quiz scores...");
    const userQuizScores = await sourceDb.select().from(schema.userQuizScores);
    if (userQuizScores.length > 0) {
      for (const userQuizScore of userQuizScores) {
        await targetDb.insert(schema.userQuizScores).values(userQuizScore).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${userQuizScores.length} user quiz scores`);
    } else {
      console.log("ℹ️ No user quiz scores to migrate");
    }
    
    // Migrate user streaks
    console.log("📋 Migrating user streaks...");
    const userStreaks = await sourceDb.select().from(schema.userStreaks);
    if (userStreaks.length > 0) {
      for (const userStreak of userStreaks) {
        await targetDb.insert(schema.userStreaks).values(userStreak).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${userStreaks.length} user streaks`);
    } else {
      console.log("ℹ️ No user streaks to migrate");
    }
    
    // Migrate storage objects
    console.log("📋 Migrating storage objects...");
    const storageObjects = await sourceDb.select().from(schema.storageObjects);
    if (storageObjects.length > 0) {
      for (const storageObject of storageObjects) {
        await targetDb.insert(schema.storageObjects).values(storageObject).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${storageObjects.length} storage objects`);
    } else {
      console.log("ℹ️ No storage objects to migrate");
    }
    
    console.log("✅ Data migration to Supabase completed successfully!");
    
  } catch (error) {
    console.error("❌ Data migration failed:", error);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

migrateData();