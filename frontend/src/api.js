const API_BASE = '/api';

/**
 * Generate an AI email reply
 * @param {string} message - Customer message
 * @returns {Promise<{id: number, reply: string, response_time: number}>}
 */
export const generateReply = async (message) => {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate reply');
  }

  return response.json();
};

/**
 * Get all history
 * @returns {Promise<Array>}
 */
export const getHistory = async () => {
  const response = await fetch(`${API_BASE}/history`);

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  const data = await response.json();
  return data.history;
};

/**
 * Update feedback for a reply
 * @param {number} id - Reply ID
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>}
 */
export const updateFeedback = async (id, feedbackData) => {
  const response = await fetch(`${API_BASE}/feedback/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update feedback');
  }

  return response.json();
};
