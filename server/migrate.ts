import { db, pool } from "./db";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("🚀 Creating database tables...");

  try {
    // Drop all tables in reverse order to avoid foreign key constraints
    await db.execute(sql`
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
    `);
    console.log("✅ Dropped existing tables");

    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar_url TEXT,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        color TEXT,
        icon TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audibles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        audio_url TEXT NOT NULL,
        length_sec INTEGER NOT NULL,
        cover_image TEXT,
        topic_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX audible_topic_id_idx ON audibles(topic_id);

      CREATE TABLE IF NOT EXISTS flashcards (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER NOT NULL,
        headline TEXT NOT NULL,
        bullets TEXT[],
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX flashcard_topic_id_idx ON flashcards(topic_id);

      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX question_topic_id_idx ON quiz_questions(topic_id);

      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        audible_id INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, audible_id)
      );
      CREATE INDEX progress_user_id_idx ON user_progress(user_id);

      CREATE TABLE IF NOT EXISTS user_flashcards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        reviewed_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, card_id)
      );
      CREATE INDEX flashcard_user_id_idx ON user_flashcards(user_id);

      CREATE TABLE IF NOT EXISTS user_quiz_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        taken_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX quiz_user_id_idx ON user_quiz_scores(user_id);
      CREATE INDEX user_topic_idx ON user_quiz_scores(user_id, topic_id);

      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total_xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        badges TEXT[] DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS storage_objects (
        id SERIAL PRIMARY KEY,
        bucket TEXT NOT NULL,
        path TEXT NOT NULL,
        filename TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        uploaded_by INTEGER NOT NULL,
        public_url TEXT,
        uploaded_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(bucket, path)
      );
    `);

    console.log("✅ Created tables");
    
  } catch (error) {
    console.error("Error migrating database:", error);
  } finally {
    await pool.end();
  }
}

migrate();