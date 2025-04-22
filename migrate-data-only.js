// This script migrates data from Neon to Supabase after tables are created
import { createClient } from '@supabase/supabase-js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './shared/schema.js';

// Set up WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Define table names in the order they should be migrated (respecting foreign keys)
const TABLES = [
  { schemaName: 'users', tableName: 'users' },
  { schemaName: 'topics', tableName: 'topics' },
  { schemaName: 'audibles', tableName: 'audibles' },
  { schemaName: 'flashcards', tableName: 'flashcards' },
  { schemaName: 'quizQuestions', tableName: 'quiz_questions' },
  { schemaName: 'userProgress', tableName: 'user_progress' },
  { schemaName: 'userFlashcards', tableName: 'user_flashcards' },
  { schemaName: 'userQuizScores', tableName: 'user_quiz_scores' },
  { schemaName: 'userStreaks', tableName: 'user_streaks' },
  { schemaName: 'userAchievements', tableName: 'user_achievements' },
  { schemaName: 'storageObjects', tableName: 'storage_objects' }
];

async function migrateData() {
  console.log("🔄 Starting data migration to Supabase...");
  
  try {
    // Connect to source database (Neon)
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    
    const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });
    const sourceDb = drizzle(sourcePool, { schema });
    
    console.log("✅ Connected to source database (Neon)");
    
    // Connect to destination (Supabase)
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log("✅ Connected to Supabase");
    
    // Migrate each table
    for (const table of TABLES) {
      await migrateTable(sourceDb, supabase, table.schemaName, table.tableName);
    }
    
    console.log("✅ Data migration completed!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  }
}

async function migrateTable(sourceDb, supabase, schemaName, tableName) {
  console.log(`Migrating ${tableName}...`);
  
  try {
    // Fetch data from source
    const schemaTable = schema[schemaName];
    if (!schemaTable) {
      console.error(`Schema table ${schemaName} not found!`);
      return;
    }
    
    const sourceData = await sourceDb.select().from(schemaTable);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records in ${tableName}`);
    
    // Migrate in batches to avoid request size limits
    const batchSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, Math.min(i + batchSize, sourceData.length));
      
      // Insert into Supabase
      const { error, count } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting batch into ${tableName}:`, error.message);
      } else {
        successCount += count || batch.length;
        console.log(`Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sourceData.length/batchSize)} for ${tableName}`);
      }
    }
    
    console.log(`✅ Migrated ${successCount}/${sourceData.length} records for ${tableName}`);
    
  } catch (error) {
    console.error(`Error migrating ${tableName}:`, error.message);
  }
}

// Run migration
migrateData();