# Migration to Supabase Database

This document outlines the steps to migrate your application from Neon to Supabase database.

## Prerequisites

1. A Supabase account and project
2. Supabase database connection string (available in Supabase dashboard)
3. Node.js and npm installed

## Setup Steps

### 1. Get Supabase Connection String

1. Log into your Supabase dashboard
2. Go to Project Settings > Database
3. Under "Connection String", select "URI" format
4. Copy the connection string

### 2. Set Environment Variables

Add the Supabase connection string to your environment:

```
SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Validate Supabase Connection

Run the validation script to ensure your connection works:

```bash
node validate-supabase-connection.js
```

If there are issues, check:
- Password is correct in the connection string
- IP whitelist in Supabase database settings includes your server's IP
- Supabase project is active

### 4. Run the Migration

Once the connection is validated, run the migration script:

```bash
node migrate-to-supabase.js
```

This will:
1. Create the schema in Supabase
2. Migrate all data from your current database to Supabase

### 5. Update Database Configuration

After successful migration, update the database configuration in `server/db.ts`:

1. Uncomment the Supabase configuration
2. Comment out or remove the Neon configuration

### 6. Verify the Migration

Test your application thoroughly to make sure everything works with the new database.

## Troubleshooting

### Connection Issues
- Check your IP is whitelisted in Supabase
- Verify the connection string format
- Ensure your Supabase project is active

### Migration Failures
- Check for schema compatibility issues
- Look for unique constraint violations
- Verify table permissions in Supabase

## Rollback Plan

If issues occur, the application can continue using the original Neon database while troubleshooting the migration.