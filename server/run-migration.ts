import { db, pool } from './db';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const readFile = promisify(fs.readFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('Running database migrations...');
  
  try {
    // Get migration file
    const migrationFilePath = path.join(__dirname, 'migrations/add-onboarding-complete.sql');
    console.log('Migration file path:', migrationFilePath);
    const sql = await readFile(migrationFilePath, 'utf8');
    
    // Run migration
    await pool.query(sql);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await pool.end();
  }
}

runMigration();