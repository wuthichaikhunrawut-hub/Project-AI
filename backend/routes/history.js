const express = require('express');
const router = express.Router();
const { sql } = require('../db');

/**
 * GET /api/history
 * Fetch all generated email replies ordered by most recent first
 */
router.get('/', async (req, res) => {
  try {
    const result = await sql`
      SELECT id, customer_message, ai_reply, edited_reply, status, feedback, response_time, created_at
      FROM email_replies
      ORDER BY created_at DESC
    `;
    console.log(`Fetched ${result.length} rows from history`);

    res.json({
      history: result,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
    });
  }
});

module.exports = router;
