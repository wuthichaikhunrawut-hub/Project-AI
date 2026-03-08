import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS email_replies (
      id SERIAL PRIMARY KEY,
      customer_message TEXT NOT NULL,
      ai_reply TEXT,
      edited_reply TEXT,
      status TEXT DEFAULT 'generated',
      feedback TEXT,
      submit_time TIMESTAMP,
      response_time INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Error initializing database table:', error);
    throw error;
  }
};