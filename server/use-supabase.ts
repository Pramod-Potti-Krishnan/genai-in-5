/**
 * This file provides an alternate database configuration using Supabase.
 * To use this configuration, rename this file to db.ts after successful migration.
 */

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Create a PostgreSQL pool with Supabase connection
export const pool = new pg.Pool({ 
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase SSL connection
});

// Create drizzle instance with PostgreSQL adapter
export const db = drizzle(pool, { schema });