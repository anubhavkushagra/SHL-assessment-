// // controllers/aiController.js
// const axios = require("axios");

// const getRecommendations = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     console.log("➡️ Incoming Request Body:", req.body);

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "Gemini API key not configured in environment." });
//     }

//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//     const response = await axios.post(
//       url,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       },
//       {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
//     res.status(200).json({ recommendation: generatedText });

//   } catch (error) {
//     console.error("❌ Gemini API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Something went wrong while calling Gemini API.",
//       details: error.response?.data || error.message
//     });
//   }
// };

// module.exports = { getRecommendations };


// controllers/aiController.js
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

Given the following job description or query: "${prompt}"

Return a JSON object with a key "recommendations" containing up to 10 SHL assessments. Each assessment should be an object with:
- "name": string
- "url": string
- "remote_support": true/false
- "adaptive_irt_support": true/false
- "duration": string (e.g., "20 minutes")
- "test_type": one of ["Cognitive", "Behavioral", "Personality", "Language", "Skill", "Technical"]

Strictly return only the valid JSON with no extra text. Make sure it's parseable.
          `
        }]
      }]
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // ✅ Remove Markdown backticks if present
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
