import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your .env file
});

async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migrations...');
    await pool.query(sql);

    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
