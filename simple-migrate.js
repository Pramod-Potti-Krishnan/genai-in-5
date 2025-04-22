// Simple migration script that uses existing database connections
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Set up WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Source database (Neon)
const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });

// We need to dynamically import the schema to handle TS files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a workaround to import the schema
let schema;
let db;

// We'll need to get the schema and tables separately
async function setupDb() {
  try {
    // First import the schema module dynamically
    const schemaModule = await import('./shared/schema.js');
    schema = schemaModule;
    
    // Now set up the db with the imported schema
    db = drizzle(sourcePool, { schema });
    
    return {
      db,
      users: schema.users,
      topics: schema.topics,
      audibles: schema.audibles,
      flashcards: schema.flashcards,
      quizQuestions: schema.quizQuestions,
      userProgress: schema.userProgress,
      userFlashcards: schema.userFlashcards,
      userQuizScores: schema.userQuizScores,
      userStreaks: schema.userStreaks,
      userAchievements: schema.userAchievements,
      storageObjects: schema.storageObjects
    };
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

async function migrateToSupabase() {
  console.log("🔄 Starting migration to Supabase...");
  
  try {
    // Setup our database and get all schema tables
    const { 
      db: sourceDb, 
      users, 
      topics, 
      audibles, 
      flashcards, 
      quizQuestions, 
      userProgress, 
      userFlashcards, 
      userQuizScores, 
      userStreaks, 
      userAchievements, 
      storageObjects 
    } = await setupDb();
    
    // Verify Supabase connection
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log("✅ Supabase client initialized");
    
    // Set the global db variable for use in migrateTable
    db = sourceDb;
    
    // Migrate data
    console.log("🔄 Migrating data...");
    await migrateTable(supabase, 'users', users);
    await migrateTable(supabase, 'topics', topics);
    await migrateTable(supabase, 'audibles', audibles);
    await migrateTable(supabase, 'flashcards', flashcards);
    await migrateTable(supabase, 'quiz_questions', quizQuestions);
    await migrateTable(supabase, 'user_progress', userProgress);
    await migrateTable(supabase, 'user_flashcards', userFlashcards);
    await migrateTable(supabase, 'user_quiz_scores', userQuizScores);
    await migrateTable(supabase, 'user_streaks', userStreaks);
    await migrateTable(supabase, 'user_achievements', userAchievements);
    await migrateTable(supabase, 'storage_objects', storageObjects);
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  }
}

async function migrateTable(supabase, tableName, tableSchema) {
  try {
    console.log(`Migrating ${tableName}...`);
    
    // Fetch data from source database
    const sourceData = await db.select().from(tableSchema);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records to migrate in ${tableName}`);
    
    // For large datasets, migrate in batches of 100
    const batchSize = 100;
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, i + batchSize);
      
      // Insert data into Supabase
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error migrating batch for ${tableName}:`, error.message);
      } else {
        console.log(`Migrated batch ${i/batchSize + 1} of ${Math.ceil(sourceData.length/batchSize)} for ${tableName}`);
      }
    }
    
    console.log(`✅ ${tableName} migration completed`);
  } catch (error) {
    console.error(`Error migrating ${tableName}:`, error.message);
  }
}

migrateToSupabase();