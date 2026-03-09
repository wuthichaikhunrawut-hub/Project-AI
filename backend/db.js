const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
});

const initializeDatabase = async () => {
  try {
    // Ensure table exists with all columns
    await sql`
      CREATE TABLE IF NOT EXISTS email_replies (
        id SERIAL PRIMARY KEY,
        customer_message TEXT NOT NULL,
        ai_reply TEXT NOT NULL,
        edited_reply TEXT,
        status VARCHAR(50) DEFAULT 'generated',
        feedback TEXT,
        submit_time TIMESTAMP,
        response_time INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Check if created_at column exists, if not add it (for backward compatibility)
    await sql.unsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='email_replies' AND column_name='created_at') THEN
          ALTER TABLE email_replies ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);
    
    console.log('Database table initialized successfully with postgres.js');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  sql,
  initializeDatabase,
};
