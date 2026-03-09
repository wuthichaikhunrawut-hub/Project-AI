const express = require('express');
const router = express.Router();
const { sql } = require('../db');
const { generateReply } = require('../gemini');

/**
 * POST /api/generate
 * Generate an AI email reply based on customer message
 */
router.post('/', async (req, res) => {
  const { message } = req.body;

  // Validation: Check if message is provided and at least 10 characters
  if (!message || message.trim().length < 10) {
    return res.status(400).json({
      error: 'Message must be at least 10 characters long',
    });
  }

  const submitTime = new Date();

  try {
    // Generate AI reply
    const aiReply = await generateReply(message);

    // Calculate response time in milliseconds
    const responseTime = new Date() - submitTime;

    // Save to database using postgres.js
    console.log('Inserting into DB using postgres.js');
    const result = await sql`
      INSERT INTO email_replies (customer_message, ai_reply, submit_time, response_time, status)
      VALUES (${message}, ${aiReply}, ${submitTime}, ${responseTime}, 'generated')
      RETURNING id, ai_reply, response_time
    `;

    if (result && result.length > 0) {
      res.json({
        id: result[0].id,
        reply: result[0].ai_reply,
        response_time: result[0].response_time,
      });
    } else {
      console.error('DB Insert returned no results');
      throw new Error('Failed to retrieve inserted row');
    }
  } catch (error) {
    console.error('Error generating reply:', error);
    res.status(500).json({
      error: 'Failed to generate reply. Please try again.',
    });
  }
});

module.exports = router;
