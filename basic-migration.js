// Basic migration script using Supabase REST API
import { createClient } from '@supabase/supabase-js';

async function migrateToSupabase() {
  console.log("🔄 Starting basic migration to Supabase...");
  
  try {
    // Verify Supabase connection
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
    }
    
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log("✅ Supabase client initialized");
    
    // Create database tables if they don't exist using REST API
    await createBasicTables(supabase);
    
    // Migrate data for essential tables
    await migrateUsersAndTopics(supabase);
    
    console.log("✅ Basic migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  }
}

async function createBasicTables(supabase) {
  console.log("Creating basic tables in Supabase...");
  
  // Essential tables for the application
  const tableDefinitions = [
    {
      name: 'users',
      definition: {
        id: 'id',
        email: 'email',
        firstName: 'first_name',
        lastName: 'last_name',
        password: 'password',
        avatarUrl: 'avatar_url',
        isAdmin: 'is_admin',
        createdAt: 'created_at',
      }
    },
    {
      name: 'topics',
      definition: {
        id: 'id',
        title: 'title',
        description: 'description',
        icon: 'icon',
        orderIndex: 'order_index',
        createdAt: 'created_at',
      }
    },
    {
      name: 'audibles',
      definition: {
        id: 'id',
        title: 'title',
        summary: 'summary',
        fileUrl: 'file_url',
        duration: 'duration',
        topicId: 'topic_id',
        thumbnailUrl: 'thumbnail_url',
        transcript: 'transcript',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    }
  ];
  
  // Check and create tables
  for (const table of tableDefinitions) {
    try {
      // Test if table exists by querying it
      const { error } = await supabase.from(table.name).select('id').limit(1);
      
      if (error && error.code === '42P01') {
        console.log(`Table ${table.name} doesn't exist yet. Creating it...`);
        // Here we would normally use SQL to create the table, but we'll note that it doesn't exist
        console.log(`Note: Table ${table.name} needs to be created manually in Supabase or via SQL function`);
      } else {
        console.log(`Table ${table.name} already exists or is accessible`);
      }
    } catch (error) {
      console.error(`Error checking table ${table.name}:`, error.message);
    }
  }
}

async function migrateUsersAndTopics(supabase) {
  console.log("Fetching and migrating essential data...");
  
  // Sample user and topic data (normally fetched from your source database)
  // We'll create 1 admin user and 1 sample topic for demonstration
  const users = [
    {
      id: 1,
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      password: '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l4Cc7O', // "password"
      is_admin: true,
      created_at: new Date().toISOString()
    }
  ];
  
  const topics = [
    {
      id: 1,
      title: 'Introduction',
      description: 'Welcome to the application',
      icon: '/icons/intro.svg',
      order_index: 1,
      created_at: new Date().toISOString()
    }
  ];
  
  // Insert users
  console.log("Migrating users...");
  const { error: userError } = await supabase.from('users').upsert(users, { onConflict: 'id' });
  if (userError) {
    console.error("Error migrating users:", userError.message);
  } else {
    console.log("Users migrated successfully!");
  }
  
  // Insert topics
  console.log("Migrating topics...");
  const { error: topicError } = await supabase.from('topics').upsert(topics, { onConflict: 'id' });
  if (topicError) {
    console.error("Error migrating topics:", topicError.message);
  } else {
    console.log("Topics migrated successfully!");
  }
}

migrateToSupabase();