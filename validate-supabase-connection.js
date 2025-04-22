#!/usr/bin/env node

/**
 * This script tests the connection to the Supabase database.
 * Run this before attempting to migrate to verify your credentials are correct.
 * 
 * Usage: node validate-supabase-connection.js
 */

import pg from 'pg';
const { Client } = pg;

async function validateSupabaseConnection() {
  console.log("🧪 Validating Supabase database connection...\n");
  
  if (!process.env.SUPABASE_DATABASE_URL) {
    console.error("❌ ERROR: SUPABASE_DATABASE_URL environment variable is not set.");
    console.log("\nPlease set the SUPABASE_DATABASE_URL environment variable with your Supabase database connection string.");
    console.log("You can find this in your Supabase dashboard under Settings > Database > Connection string > URI format.\n");
    process.exit(1);
  }
  
  // Extract domain for display
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  const domain = supabaseUrl.includes('@') ? 
    supabaseUrl.split('@')[1].split('/')[0] : 
    "unknown-domain";
  
  console.log(`🔗 Testing connection to Supabase at ${domain}`);
  
  const client = new Client({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    // Connect to the database
    await client.connect();
    console.log("✅ Successfully connected to Supabase database!");
    
    // Run a simple query to verify connection is working properly
    const result = await client.query('SELECT version()');
    console.log(`\n📊 Database version: ${result.rows[0].version.split(',')[0]}`);
    
    // Get database size info
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `);
    console.log(`📁 Database size: ${sizeResult.rows[0].db_size}`);
    
    // Show connection info
    console.log("\n✨ Your Supabase connection is valid and ready for migration!");
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n⚠️ Please check your Supabase database connection settings:");
    console.log("1. Verify that the SUPABASE_DATABASE_URL is correct");
    console.log("2. Ensure your IP address is allowed in Supabase's database settings");
    console.log("   - Go to Supabase Dashboard > Project Settings > Database > Network");
    console.log("   - Add your current IP address to the allowed list");
    console.log("3. Check if the Supabase database is online and accessible\n");
  } finally {
    await client.end();
  }
}

validateSupabaseConnection();