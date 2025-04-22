import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Fallback to the existing Neon database until migration is complete
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Note: Once migration is complete, you can switch to this Supabase configuration:
/*
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Create a PostgreSQL pool with Supabase connection
export const pool = new pg.Pool({ 
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
});

// Create drizzle instance with PostgreSQL adapter
export const db = drizzle(pool, { schema });
*/