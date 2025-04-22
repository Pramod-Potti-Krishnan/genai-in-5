import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check for Supabase connection string
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error(
    "SUPABASE_DATABASE_URL must be set for Supabase connection",
  );
}

// Create a PostgreSQL pool with Supabase connection
export const pool = new pg.Pool({ 
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
});

// Create drizzle instance with PostgreSQL adapter
export const db = drizzle(pool, { schema });