const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');



router.post('/recommend', getRecommendations);

module.exports = router;


// const express = require("express");
// const router = express.Router();

// // ❌ Don’t do this:
// // const generateRecommendation = require("../controllers/aiController");

// // ✅ Do this:
// const { generateRecommendation } = require("../controllers/aiController");

// router.post("/generate", generateRecommendation);

// module.exports = router;
