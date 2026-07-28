const express = require("express");
const router = express.Router();

const { getRecommendations, getSuggestedPeers } = require("../controllers/recommendation");
const { optionalAuth } = require("../middleware/auth");

router.route("/recommendations").get(optionalAuth, getRecommendations);
router.route("/recommendations/peers").get(optionalAuth, getSuggestedPeers);

module.exports = router;
