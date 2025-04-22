import { createClient } from '@supabase/supabase-js';

async function testSupabaseClient() {
  console.log("🧪 Testing Supabase connection with JavaScript client...");
  
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    
    console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    // Test connection with a simple query
    console.log("Testing connection...");
    const { data, error } = await supabase
      .from('users') // Try to access a table that might exist in our schema
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist error
        console.log("Table 'users' doesn't exist yet, but connection works!");
        
        // Try to create a test table
        console.log("Creating a test table...");
        const { error: createError } = await supabase.rpc('create_test_table');
        
        if (createError) {
          console.log("Couldn't create test table, but that's expected. RPC probably doesn't exist.");
          console.log("Error:", createError.message);
        } else {
          console.log("Test table created successfully!");
        }
      } else {
        throw error;
      }
    } else {
      console.log("Successfully connected and queried data!");
      console.log(`Found ${data.length} rows in the users table`);
    }
    
    // If we get here, connection works!
    console.log("✅ Connection to Supabase successful!");
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error details:", error);
    return false;
  }
}

testSupabaseClient();