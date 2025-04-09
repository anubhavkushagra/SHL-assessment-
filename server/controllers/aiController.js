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
          
          Each assessment must be an object with the following keys:
          - "url": string (Always use "https://www.shl.com/solutions/products/product-catalog/")
          - "adaptive_support": "Yes" or "No"
          - "remote_support": "Yes" or "No"
          - "description": string (brief 1–2 line explanation of what the test measures and its target audience)
          - "duration": number (in minutes, e.g. 20, 30)
          - "test_type": array of strings (e.g., ["Cognitive"], ["Personality & Behaviour"])
          
          Do not generate or assume specific links. Use only this URL:
          https://www.shl.com/solutions/products/product-catalog/
          
          Strictly return valid JSON only. No markdown, no explanations, no extra formatting.
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
