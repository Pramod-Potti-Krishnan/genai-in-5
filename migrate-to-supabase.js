#!/usr/bin/env node

// Script to run the migration scripts in sequence
// Usage: node migrate-to-supabase.js

console.log("🚀 Starting Supabase migration...");

async function runMigration() {
  try {
    // Step 1: Run the schema migration
    console.log("\n📦 Step 1: Migrating schema to Supabase...");
    await import('./migrate-to-supabase.ts');
    
    // Step 2: Run the data migration
    console.log("\n📤 Step 2: Migrating data to Supabase...");
    await import('./migrate-data-to-supabase.ts');
    
    console.log("\n✨ Migration to Supabase completed!");
    console.log("🔄 You can now update your .env file to use SUPABASE_DATABASE_URL as your main DATABASE_URL");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();