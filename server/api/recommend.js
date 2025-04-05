// api/recommend.js
const { getRecommendations } = require('../controllers/aiController');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await getRecommendations(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
