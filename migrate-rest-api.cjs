// Migration script using REST API
const { Pool } = require('pg');
const fetch = require('node-fetch');
require('dotenv').config();

// Get database credentials from environment
const sourceDbUrl = process.env.DATABASE_URL;
const supabaseUrl = "https://oztffoxsvmbhgoxzqicl.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY;

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
  console.log("🔄 Starting REST API migration to Supabase...");
  
  // Source connection
  const sourcePool = new Pool({ 
    connectionString: sourceDbUrl
  });
  
  try {
    console.log("Testing connections...");
    
    // Test source connection
    await sourcePool.query('SELECT NOW()');
    console.log("✅ Connected to source database (Neon)");
    
    // Test Supabase REST API connection
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.status === 200 || response.status === 404) {
      // 404 is also acceptable as it means the endpoint exists but no route matches
      console.log("✅ Connected to Supabase REST API");
    } else {
      console.log(`⚠️ Supabase REST API returned status: ${response.status}`);
    }
    
    // Migrate each table
    for (const tableName of TABLES) {
      await migrateTable(sourcePool, tableName);
    }
    
    console.log("✅ Data migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  } finally {
    // Close connection
    sourcePool.end();
  }
}

async function migrateTable(sourcePool, tableName) {
  console.log(`\nMigrating ${tableName}...`);
  
  try {
    // Get data from source
    const { rows: sourceData } = await sourcePool.query(`SELECT * FROM ${tableName}`);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records in ${tableName}`);
    
    // Migrate in batches to avoid request size limits
    const batchSize = 20; // Smaller batch size for REST API
    let successCount = 0;
    
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, Math.min(i + batchSize, sourceData.length));
      
      // Insert into Supabase via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(batch)
      });
      
      if (response.ok) {
        successCount += batch.length;
        console.log(`Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sourceData.length/batchSize)} for ${tableName}`);
      } else {
        const errorText = await response.text();
        console.error(`Error inserting batch into ${tableName}:`, response.status, errorText);
      }
    }
    
    console.log(`✅ Migrated ${successCount}/${sourceData.length} records for ${tableName}`);
    
  } catch (error) {
    console.error(`Error migrating ${tableName}:`, error.message);
  }
}

// Run migration
migrateData().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});