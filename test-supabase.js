import pg from 'pg';

// Simple script to test Supabase database connection
async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection...");
  
  try {
    if (!process.env.SUPABASE_DATABASE_URL) {
      throw new Error("SUPABASE_DATABASE_URL is not set");
    }
    
    const url = process.env.SUPABASE_DATABASE_URL;
    console.log(`Connection string format check:`);
    console.log(`- Starts with postgresql://: ${url.startsWith('postgresql://')}`);
    console.log(`- Contains @ symbol: ${url.includes('@')}`);
    console.log(`- Contains port (5432): ${url.includes(':5432')}`);
    
    const parts = url.split('@');
    if (parts.length === 2) {
      const hostPart = parts[1].split('/')[0];
      console.log(`- Host: ${hostPart}`);
    }
    
    // Create client
    const client = new pg.Client({
      connectionString: process.env.SUPABASE_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    // Connect
    console.log("Connecting to database...");
    await client.connect();
    console.log("✅ Connection successful!");
    
    // Test query
    const result = await client.query('SELECT current_database() as db_name');
    console.log(`Connected to database: ${result.rows[0].db_name}`);
    
    await client.end();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

testSupabaseConnection();