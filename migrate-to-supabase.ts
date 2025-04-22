import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from "./shared/schema";

// Check for Supabase connection string
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL must be set for Supabase connection");
}

async function migrateToSupabase() {
  console.log("🔄 Preparing migration to Supabase...");
  
  // Create a PostgreSQL pool with Supabase connection
  const pool = new pg.Pool({ 
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
  });
  
  // Create drizzle instance with PostgreSQL adapter
  const db = drizzle(pool, { schema });
  
  try {
    console.log("🏗️ Creating schema in Supabase...");
    // Push the schema to Supabase - this will create all tables
    await migrate(db, { migrationsFolder: './migrations' });
    
    console.log("✅ Schema successfully migrated to Supabase!");
    
    // Data migration can be added here later if needed
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrateToSupabase();