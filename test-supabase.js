import pg from 'pg';

// Simple script to test Supabase database connection using direct URL
async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection with direct URL...");
  
  try {
    // Use direct connection string
    const connectionString = 'postgresql://postgres:B08SwMbIPZpIMTGF@db.oztffoxsvmbhgoxzqicl.supabase.co:5432/postgres';
    
    console.log("Connection string format check:");
    console.log(`- Starts with postgresql://: ${connectionString.startsWith('postgresql://')}`);
    console.log(`- Contains @ symbol: ${connectionString.includes('@')}`);
    console.log(`- Contains port (5432): ${connectionString.includes(':5432')}`);
    
    const parts = connectionString.split('@');
    if (parts.length === 2) {
      const hostPart = parts[1].split('/')[0];
      console.log(`- Host: ${hostPart}`);
    }
    
    // Create client
    const client = new pg.Client({
      connectionString: connectionString,
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
    console.error("Error details:", error);
  }
}

testSupabaseConnection();