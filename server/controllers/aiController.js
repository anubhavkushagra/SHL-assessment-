const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.getRecommendations = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `
You are an intelligent SHL Assessment Recommendation System.

Given the following job description or query: "${prompt}",

Return a JSON object with the key "recommended_assessments" which contains an array of up to 10 SHL assessments.

Each assessment must include the following keys:
- "name": string (the exact test name)
- "url": string (must follow the format: "https://www.shl.com/solutions/products/product-catalog/<name-slug>", where <name-slug> is the test name in lowercase, words separated by hyphens, and special characters removed)
- "adaptive_support": "Yes" or "No"
- "remote_support": "Yes" or "No"
- "description": string (1–2 line summary of the assessment's purpose and audience)
- "duration": number (in minutes, e.g., 20)
- "test_type": array of strings (e.g., ["Cognitive"], ["Personality & Behaviour"])

Example URL format:
If the test name is "Verify Numerical Reasoning", the URL must be:
https://www.shl.com/solutions/products/product-catalog/verify-numerical-reasoning

Strictly return a valid JSON object with no extra explanation, no markdown, and no formatting outside the JSON.
`

        }]
      }]
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // ✅ Remove Markdown block if present
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
