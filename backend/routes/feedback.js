const express = require('express');
const router = express.Router();
const { sql } = require('../db');

/**
 * PUT /api/feedback/:id
 * Update reply with human edits or feedback
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { edited_reply, status, feedback } = req.body;

  try {
    // Check if record exists
    const checkResult = await sql`SELECT id FROM email_replies WHERE id = ${id}`;

    if (checkResult.length === 0) {
      return res.status(404).json({
        error: 'Reply not found',
      });
    }

    // Build update object
    const updateObj = {};
    if (edited_reply !== undefined) updateObj.edited_reply = edited_reply;
    if (status !== undefined) updateObj.status = status;
    if (feedback !== undefined) updateObj.feedback = feedback;

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
      });
    }

    const result = await sql`
      UPDATE email_replies
      SET ${sql(updateObj)}
      WHERE id = ${id}
      RETURNING id, customer_message, ai_reply, edited_reply, status, feedback, created_at
    `;

    res.json({
      message: 'Feedback updated successfully',
      reply: result[0],
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      error: 'Failed to update feedback',
    });
  }
});

module.exports = router;
