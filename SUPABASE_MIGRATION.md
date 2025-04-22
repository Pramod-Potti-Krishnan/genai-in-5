# Migration to Supabase

This document outlines the steps to migrate the database from Neon to Supabase.

## Prerequisites

- Supabase project with database access
- Supabase project URL
- Supabase anon key
- Access to Supabase SQL Editor

## Migration Steps

### 1. Set up environment variables

Set up the required environment variables for Supabase:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

### 2. Create tables in Supabase

1. Generate the SQL script for creating tables:
   ```
   node create-supabase-tables.js
   ```

2. Follow the instructions from the script output:
   - Go to your Supabase dashboard
   - Click on 'SQL Editor' in the left sidebar
   - Click 'New Query'
   - Paste the generated SQL and run it

3. Verify that all tables were created properly in Supabase

### 3. Migrate data from Neon to Supabase

Once tables are created, run the data migration script:
```
node migrate-data-only.js
```

This script will:
- Connect to both Neon (source) and Supabase (destination)
- Read data from each table in Neon
- Write data to corresponding tables in Supabase
- Handle foreign key relationships by migrating tables in the correct order

### 4. Update the application code to use Supabase

After successful migration, update the database configuration:

1. Modify `server/db.ts` to use Supabase:
   ```typescript
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
   ```

2. Test the application thoroughly to ensure everything works with Supabase.

## Troubleshooting

### Connection Issues

- If the direct PostgreSQL connection fails, your IP might not be allowed. Go to Supabase Project Settings > Database > Connection Pooling and ensure your IP is allowed.

- For DNS resolution issues with `db.xxx.supabase.co` domains, try using the Supabase REST API instead of direct PostgreSQL connection.

### Migration Errors

- For tables with foreign key constraints, ensure you're migrating in the correct order (users first, then related tables).

- If you encounter `Error: undefined` when inserting data, check the Supabase dashboard logs for more details.

- For large datasets, try migrating tables individually or reducing the batch size in the migration script.