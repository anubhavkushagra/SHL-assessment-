const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.getRecommendations = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `
You are an intelligent SHL Assessment Recommendation System.

Given the following job description or query: "\${query}",

Return a JSON object with the key "recommended_assessments" containing an array of up to 10 SHL assessments.

Each assessment must include exactly the following keys **in this order**:
- "url": string (Format: "https://www.shl.com/solutions/products/product-catalog/<slugified-test-name>")
- "adaptive_support": "Yes" or "No"
- "description": string (Brief 1–2 line explanation of what the test measures and its purpose)
- "duration": number (in minutes, e.g., 20)
- "remote_support": "Yes" or "No"
- "test_type": array of strings (e.g., ["Cognitive"], ["Personality & Behaviour"])

🚫 Do not include a "name" key or any extra fields.

Strictly return only a valid JSON object with these keys — no markdown, no explanations, no formatting outside the JSON.
`


        }]
      }]
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

  
    if (aiText.startsWith("```")) {
      aiText = aiText.replace(/```(?:json)?\n?/, '').replace(/```$/, '');
    }

    try {
      const parsed = JSON.parse(aiText);
      return res.json(parsed);
    } catch (parseErr) {
      return res.status(500).json({
        error: "Failed to parse AI response as JSON after cleanup.",
        raw: aiText
      });
    }

  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Something went wrong while calling Gemini API.",
      details: err.response?.data || err.message
    });
  }
};
