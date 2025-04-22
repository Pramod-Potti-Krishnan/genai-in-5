// Direct database migration using PostgreSQL connections
const { Pool } = require('pg');
require('dotenv').config();

// Get database credentials from environment
const sourceDbUrl = process.env.DATABASE_URL;
const targetDbUrl = process.env.SUPABASE_DATABASE_URL;

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
  console.log("🔄 Starting direct database migration to Supabase...");
  
  // Source connection
  const sourcePool = new Pool({ 
    connectionString: sourceDbUrl
  });

  // Target connection
  const targetPool = new Pool({ 
    connectionString: targetDbUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
  });
  
  try {
    console.log("Testing connections...");
    
    // Test source connection
    await sourcePool.query('SELECT NOW()');
    console.log("✅ Connected to source database (Neon)");
    
    // Test target connection
    await targetPool.query('SELECT NOW()');
    console.log("✅ Connected to target database (Supabase)");
    
    // Migrate each table
    for (const tableName of TABLES) {
      await migrateTable(sourcePool, targetPool, tableName);
    }
    
    console.log("✅ Data migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  } finally {
    // Close connections
    sourcePool.end();
    targetPool.end();
  }
}

async function migrateTable(sourcePool, targetPool, tableName) {
  console.log(`\nMigrating ${tableName}...`);
  
  try {
    // Get data from source
    const { rows: sourceData } = await sourcePool.query(`SELECT * FROM ${tableName}`);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records in ${tableName}`);
    
    // Check if target table is empty
    const { rows: targetCheck } = await targetPool.query(`SELECT COUNT(*) FROM ${tableName}`);
    const targetCount = parseInt(targetCheck[0].count);
    
    if (targetCount > 0) {
      console.log(`Table ${tableName} already has ${targetCount} records. Truncating...`);
      await targetPool.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
    }
    
    // Migrate in batches to avoid memory issues
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, Math.min(i + batchSize, sourceData.length));
      
      // For each batch item, generate an INSERT statement
      for (const record of batch) {
        const columns = Object.keys(record);
        const values = Object.values(record);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        
        const query = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT (id) DO UPDATE 
          SET ${columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ')}
        `;
        
        try {
          await targetPool.query(query, values);
          successCount++;
        } catch (insertError) {
          console.error(`Error inserting record with ID ${record.id || 'unknown'} into ${tableName}:`, insertError.message);
        }
      }
      
      console.log(`Migrated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sourceData.length/batchSize)} for ${tableName}`);
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