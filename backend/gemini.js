const axios = require("axios");

const generateReply = async (customerMessage) => {
  try {
    const baseUrl = process.env.COLAB_AI_URL.replace(/\/$/, "");

    // Step 1: Submit the request and get event_id
    const submitResponse = await axios.post(
      `${baseUrl}/gradio_api/call/predict`,
      { data: [customerMessage] },
      { headers: { "Content-Type": "application/json" } }
    );

    const eventId = submitResponse.data.event_id;
    if (!eventId) throw new Error("No event_id returned from Gradio API");

    // Step 2: Fetch the result via SSE stream
    const resultResponse = await axios.get(
      `${baseUrl}/gradio_api/call/predict/${eventId}`,
      { responseType: "text", timeout: 60000 }
    );

    // Parse SSE lines - find data line that contains an array result
    const lines = resultResponse.data.split("\n");
    let result = null;
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const dataStr = line.slice(5).trim();
        try {
          const parsed = JSON.parse(dataStr);
          if (Array.isArray(parsed)) {
            result = parsed[0];
            break;
          }
        } catch (_) {}
      }
    }

    if (result === null) throw new Error("No result found in Gradio response");
    return typeof result === "string" ? result : JSON.stringify(result);
  } catch (error) {
    console.error("Error calling Gradio AI:", error.message || error);
    throw new Error("Failed to generate AI reply");
  }
};

module.exports = { generateReply };