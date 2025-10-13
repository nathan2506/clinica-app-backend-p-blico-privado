require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

async function run() {
  const pool = require('./db');

  try {
    console.log('Dropping existing tables if any...')
    await pool.query('DROP TABLE IF EXISTS daily_reports CASCADE; DROP TABLE IF EXISTS users CASCADE;');
    console.log('Applying migrations...')
    const sql1 = fs.readFileSync('utils/sql/001_create_tables.sql', 'utf8');
    const sql2 = fs.readFileSync('utils/sql/002_seed_example.sql', 'utf8');
    await pool.query(sql1);
    await pool.query(sql2);
    console.log('Migrations and seed applied successfully');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
