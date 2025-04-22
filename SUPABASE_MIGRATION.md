# Supabase Migration Guide

This document provides detailed instructions for migrating the application from Neon PostgreSQL to Supabase.

## Prerequisites

1. Create a Supabase account and project at https://app.supabase.com/
2. Get your Supabase URL and anon key from the API settings page
3. Have access to your current database for data export

## Step 1: Set Up Environment Variables

Add the following environment variables to your `.env` file:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres
```

## Step 2: Create Tables in Supabase

Execute the following SQL in the Supabase SQL Editor to create all necessary tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  google_id TEXT,
  facebook_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audibles table
CREATE TABLE IF NOT EXISTS audibles (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  audible_id INTEGER NOT NULL REFERENCES audibles(id),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, audible_id)
);

-- Create user_flashcards table
CREATE TABLE IF NOT EXISTS user_flashcards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  flashcard_id INTEGER NOT NULL REFERENCES flashcards(id),
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 1,
  next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, flashcard_id)
);

-- Create user_quiz_scores table
CREATE TABLE IF NOT EXISTS user_quiz_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage_objects table
CREATE TABLE IF NOT EXISTS storage_objects (
  id SERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (bucket, path)
);

-- Set up RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_objects ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access to all tables
CREATE POLICY admin_all_access ON users TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON topics TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON audibles TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON flashcards TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON quiz_questions TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON user_progress TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON user_flashcards TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON user_quiz_scores TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON user_streaks TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON user_achievements TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));
CREATE POLICY admin_all_access ON storage_objects TO authenticated USING (auth.uid() IN (SELECT id::text FROM users WHERE is_admin = TRUE));

-- Create policies for user access to their own data
CREATE POLICY user_read_own ON users FOR SELECT TO authenticated USING (id::text = auth.uid());
CREATE POLICY user_update_own ON users FOR UPDATE TO authenticated USING (id::text = auth.uid());
CREATE POLICY user_read_own ON user_progress FOR SELECT TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_write_own ON user_progress FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid());
CREATE POLICY user_update_own ON user_progress FOR UPDATE TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_read_own ON user_flashcards FOR SELECT TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_write_own ON user_flashcards FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid());
CREATE POLICY user_update_own ON user_flashcards FOR UPDATE TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_read_own ON user_quiz_scores FOR SELECT TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_write_own ON user_quiz_scores FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid());
CREATE POLICY user_read_own ON user_streaks FOR SELECT TO authenticated USING (user_id::text = auth.uid());
CREATE POLICY user_read_own ON user_achievements FOR SELECT TO authenticated USING (user_id::text = auth.uid());

-- Create policies for public access to content
CREATE POLICY public_read ON topics FOR SELECT USING (true);
CREATE POLICY public_read ON audibles FOR SELECT USING (true);
CREATE POLICY public_read ON flashcards FOR SELECT USING (true);
CREATE POLICY public_read ON quiz_questions FOR SELECT USING (true);
```

## Step 3: Data Migration

There are three approaches to migrate your data to Supabase:

### Option 1: Use the REST API Migration Script (Recommended)

This method uses Supabase's REST API to avoid direct database connection issues:

1. Run the migration script:
   ```
   node migrate-to-supabase-client.js
   ```

### Option 2: Direct Database Migration (If Option 1 Fails)

If you have access to run this from a local machine or environment without network restrictions:

1. Export your script and run it locally:
   ```
   node migrate-db-direct.cjs
   ```

### Option 3: Manual Data Export/Import

If automated methods fail:

1. Export data from your current database as CSV files
2. Import the CSV files into Supabase using their dashboard

## Step 4: Update Application Code

1. Replace `db.ts` with `use-supabase.ts`:
   ```
   cp server/use-supabase.ts server/db.ts
   ```

2. Update `storage.ts` to use the Supabase client:
   ```
   cp server/supabase-storage.ts server/storage.ts
   ```

3. Update environment variables in your deployment environment

## Step 5: Test and Verify

1. Test all application functionality to ensure data is being correctly saved and retrieved
2. Verify user authentication is working correctly
3. Check that file uploads work with Supabase storage

## Troubleshooting

### Connection Issues

If you encounter connection issues from deployment environments:
- Ensure your Supabase project allows connections from your application's IP
- Try using the Supabase REST API client instead of direct database connections

### Data Migration Errors

- Check for schema mismatches between source and target databases
- Ensure unique constraints are being respected during migration
- For large datasets, consider breaking up migrations into smaller batches

### Authentication Problems

- Verify your JWT secret matches between your application and Supabase
- Check that RLS policies are correctly configured in Supabase

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Data Migration Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)