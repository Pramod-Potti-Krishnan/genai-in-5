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
  
  // Extract domain safely
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL || "";
  const domain = supabaseUrl.includes('@') ? 
    supabaseUrl.split('@')[1].split('/')[0] : 
    "unknown-domain";
  
  console.log(`🔗 Testing connection to Supabase at ${domain}`);
  
  // Create a PostgreSQL pool with Supabase connection
  const pool = new pg.Pool({ 
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
  });
  
  try {
    // Test connection
    console.log("🧪 Testing database connection...");
    await pool.query('SELECT NOW()');
    console.log("✅ Successfully connected to Supabase database!");
    
    // Create drizzle instance with PostgreSQL adapter
    const db = drizzle(pool, { schema });
    
    console.log("🏗️ Creating schema in Supabase...");
    // Push the schema to Supabase - this will create all tables
    await migrate(db, { migrationsFolder: './migrations' });
    
    console.log("✅ Schema successfully migrated to Supabase!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.log("\n⚠️ Please check your Supabase database connection settings:");
    console.log("1. Verify that the SUPABASE_DATABASE_URL is correct");
    console.log("2. Ensure your IP address is allowed in Supabase's database settings");
    console.log("3. Check if the Supabase database is online and accessible\n");
  } finally {
    await pool.end();
  }
}

migrateToSupabase();