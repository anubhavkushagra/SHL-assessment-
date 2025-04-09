const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');



router.post('/recommend', getRecommendations);

module.exports = router;



