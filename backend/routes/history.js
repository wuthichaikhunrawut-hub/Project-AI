const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * GET /api/history
 * Get all generated replies ordered by newest first
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        customer_message,
        ai_reply,
        edited_reply,
        status,
        submit_time,
        response_time,
        created_at
      FROM email_requests
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    res.json({
      history: result.rows,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
    });
  }
});

module.exports = router;
