import { createClient } from '@supabase/supabase-js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema";

neonConfig.webSocketConstructor = ws;

// Source database (Neon)
const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });
const sourceDb = drizzle(sourcePool, { schema });

// Get tables from schema
const { users, topics, audibles, flashcards, quizQuestions, 
         userProgress, userFlashcards, userQuizScores, 
         userStreaks, userAchievements, storageObjects } = schema;

async function migrateToSupabase() {
  console.log("🔄 Starting migration to Supabase...");
  
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
    
    // Create tables in Supabase (if they don't exist)
    await createTables(supabase);
    
    // Migrate data
    console.log("🔄 Migrating data...");
    await migrateTable(supabase, 'users', users);
    await migrateTable(supabase, 'topics', topics);
    await migrateTable(supabase, 'audibles', audibles);
    await migrateTable(supabase, 'flashcards', flashcards);
    await migrateTable(supabase, 'quiz_questions', quizQuestions);
    await migrateTable(supabase, 'user_progress', userProgress);
    await migrateTable(supabase, 'user_flashcards', userFlashcards);
    await migrateTable(supabase, 'user_quiz_scores', userQuizScores);
    await migrateTable(supabase, 'user_streaks', userStreaks);
    await migrateTable(supabase, 'user_achievements', userAchievements);
    await migrateTable(supabase, 'storage_objects', storageObjects);
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
  }
}

// This function creates tables in Supabase if they don't exist
async function createTables(supabase) {
  console.log("🔧 Creating tables in Supabase (if they don't exist)...");

  const tables = [
    {
      name: 'users',
      columns: `
        id integer primary key,
        email text not null unique,
        password text,
        first_name text,
        last_name text,
        username text,
        avatar_url text,
        is_admin boolean default false,
        google_id text,
        facebook_id text,
        created_at timestamp with time zone default now()
      `
    },
    {
      name: 'topics',
      columns: `
        id integer primary key,
        title text not null,
        description text,
        icon text,
        order_index integer,
        created_at timestamp with time zone default now()
      `
    },
    {
      name: 'audibles',
      columns: `
        id integer primary key,
        title text not null,
        summary text,
        file_url text,
        duration integer,
        topic_id integer references topics(id),
        thumbnail_url text,
        transcript text,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    },
    {
      name: 'flashcards',
      columns: `
        id integer primary key,
        question text not null,
        answer text not null,
        topic_id integer references topics(id),
        created_at timestamp with time zone default now()
      `
    },
    {
      name: 'quiz_questions',
      columns: `
        id integer primary key,
        question text not null,
        options text[] not null,
        correct_option integer not null,
        explanation text,
        topic_id integer references topics(id),
        difficulty text,
        created_at timestamp with time zone default now()
      `
    },
    {
      name: 'user_progress',
      columns: `
        id integer primary key,
        user_id integer references users(id),
        audible_id integer references audibles(id),
        progress_percent integer not null default 0,
        completed boolean default false,
        created_at timestamp with time zone default now(),
        unique(user_id, audible_id)
      `
    },
    {
      name: 'user_flashcards',
      columns: `
        id integer primary key,
        user_id integer references users(id),
        flashcard_id integer references flashcards(id),
        reviewed_count integer default 0,
        last_reviewed timestamp with time zone,
        created_at timestamp with time zone default now(),
        unique(user_id, flashcard_id)
      `
    },
    {
      name: 'user_quiz_scores',
      columns: `
        id integer primary key,
        user_id integer references users(id),
        topic_id integer references topics(id),
        score integer not null,
        created_at timestamp with time zone default now()
      `
    },
    {
      name: 'user_streaks',
      columns: `
        id integer primary key,
        user_id integer references users(id),
        current_streak integer default 0,
        longest_streak integer default 0,
        last_activity date,
        updated_at timestamp with time zone default now()
      `
    },
    {
      name: 'user_achievements',
      columns: `
        id integer primary key,
        user_id integer references users(id),
        achievement_type text not null,
        earned_on timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    },
    {
      name: 'storage_objects',
      columns: `
        id integer primary key,
        bucket text not null,
        path text not null,
        filename text not null,
        content_type text,
        size integer,
        metadata jsonb,
        uploaded_at timestamp with time zone default now(),
        unique(bucket, path)
      `
    }
  ];

  for (const table of tables) {
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.log(`Creating table: ${table.name}`);
        
        // Table doesn't exist, create it
        // Note: We need to use raw SQL for this since the JS client doesn't support CREATE TABLE
        const { error } = await supabase.rpc('run_sql', {
          sql: `CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns})`
        });
        
        if (error) {
          console.log(`Could not create table ${table.name}: ${error.message}`);
          // We'll try to insert data anyway - Supabase might create tables automatically
        } else {
          console.log(`Table ${table.name} created successfully`);
        }
      } else {
        console.log(`Table ${table.name} already exists`);
      }
    } catch (error) {
      console.log(`Error checking/creating table ${table.name}: ${error.message}`);
    }
  }
}

async function migrateTable(supabase, tableName, tableSchema) {
  try {
    console.log(`Migrating ${tableName}...`);
    
    // Fetch data from source database
    const sourceData = await sourceDb.select().from(tableSchema);
    
    if (!sourceData || sourceData.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return;
    }
    
    console.log(`Found ${sourceData.length} records to migrate in ${tableName}`);
    
    // For large datasets, migrate in batches of 100
    const batchSize = 100;
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, i + batchSize);
      
      // Insert data into Supabase
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error migrating batch for ${tableName}:`, error.message);
      } else {
        console.log(`Migrated batch ${i/batchSize + 1} of ${Math.ceil(sourceData.length/batchSize)} for ${tableName}`);
      }
    }
    
    console.log(`✅ ${tableName} migration completed`);
  } catch (error) {
    console.error(`Error migrating ${tableName}:`, error.message);
  }
}

migrateToSupabase();