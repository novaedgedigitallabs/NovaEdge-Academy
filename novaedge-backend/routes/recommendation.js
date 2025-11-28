const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/recommendation");
const { isAuthenticatedUser } = require("../middleware/auth");

// Public (can work with or without auth, but controller checks req.user)
// We use isAuthenticatedUser middleware but make it optional? 
// Actually, our middleware throws error if not token. 
// So let's make a wrapper or just use it for logged in users.
// The requirement implies personalized, so logged in is best.
// For homepage, if not logged in, frontend won't call this or will call a public "trending" endpoint.
// Let's assume this is for logged-in users.
router.route("/recommendations").get(isAuthenticatedUser, getRecommendations);

module.exports = router;
