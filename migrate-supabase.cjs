// CommonJS version of migration script
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
require('dotenv').config();

// Get database credentials from environment
const sourceDbUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseDbUrl = process.env.SUPABASE_DATABASE_URL;

// Define table names in the order they should be migrated (respecting foreign keys)
const TABLES = [
  'users',
  'topics',
  'audibles',
  'flashcards',
  'quiz_questions',
  'user_progress',
  'user_flashcards',
  'user_quiz_scores',
  'user_streaks',
  'user_achievements',
  'storage_objects'
];

async function migrateData() {
  console.log("🔄 Starting data migration to Supabase...");
  
  try {
    // Connect to source database (Neon)
    if (!sourceDbUrl) {
      throw new Error("DATABASE_URL is not set");
    }
    
    const sourcePool = new Pool({ connectionString: sourceDbUrl });
    console.log("✅ Connected to source database (Neon)");
    
    // Connect to destination (Supabase)
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Connected to Supabase");
    
    // Migrate each table
    for (const tableName of TABLES) {
      await migrateTable(sourcePool, supabase, tableName);
    }
    
    console.log("✅ Data migration completed!");
    
    // Close source pool
    await sourcePool.end();
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
}

async function migrateTable(sourcePool, supabase, tableName) {
  console.log(`Migrating ${tableName}...`);
  
  try {
    // Get data from source
    const { rows: sourceData } = await sourcePool.query(`SELECT * FROM ${tableName}`);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records in ${tableName}`);
    
    // Migrate in batches to avoid request size limits
    const batchSize = 50;
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