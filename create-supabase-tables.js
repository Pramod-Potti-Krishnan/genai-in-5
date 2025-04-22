// Generate SQL to create tables in Supabase
import { createClient } from '@supabase/supabase-js';

async function createSupabaseTables() {
  console.log("🔄 Generating SQL for Supabase tables...");
  
  try {
    // Output SQL directly since we're having issues with the RPC method
    console.log("\n=========== SUPABASE SQL SETUP INSTRUCTIONS ===========");
    console.log("1. Go to your Supabase dashboard");
    console.log("2. Click on 'SQL Editor' in the left sidebar");
    console.log("3. Click 'New Query'");
    console.log("4. Paste and run the following SQL to create all tables:\n");
    
    // Generate the complete SQL for table creation
    console.log(generateTablesSql());
    
    console.log("\n=========== END SUPABASE SQL SETUP INSTRUCTIONS ===========");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Error details:", error);
  }
}

function generateTablesSql() {
  return `
-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS storage_objects CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_quiz_scores CASCADE;
DROP TABLE IF EXISTS user_flashcards CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS audibles CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  google_id TEXT,
  facebook_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create topics table
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audibles table
CREATE TABLE audibles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  file_url TEXT,
  duration INTEGER,
  topic_id INTEGER REFERENCES topics(id),
  thumbnail_url TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create flashcards table
CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic_id INTEGER REFERENCES topics(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT,
  topic_id INTEGER REFERENCES topics(id),
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  audible_id INTEGER REFERENCES audibles(id),
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, audible_id)
);

-- Create user flashcards table
CREATE TABLE user_flashcards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  flashcard_id INTEGER REFERENCES flashcards(id),
  reviewed_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);

-- Create user quiz scores table
CREATE TABLE user_quiz_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  topic_id INTEGER REFERENCES topics(id),
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user streaks table
CREATE TABLE user_streaks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  achievement_type TEXT NOT NULL,
  earned_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage objects table
CREATE TABLE storage_objects (
  id SERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  metadata JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(bucket, path)
);

-- Enable Row Level Security (RLS)
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

-- Create basic policies (allow all for now - modify as needed for production)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all" ON audibles FOR ALL USING (true);
CREATE POLICY "Allow all" ON flashcards FOR ALL USING (true);
CREATE POLICY "Allow all" ON quiz_questions FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_flashcards FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_quiz_scores FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_streaks FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_achievements FOR ALL USING (true);
CREATE POLICY "Allow all" ON storage_objects FOR ALL USING (true);
`;
}

createSupabaseTables();