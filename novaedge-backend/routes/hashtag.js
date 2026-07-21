const express = require("express");
const router = express.Router();
const { getHashtagData, trackHashtagClick, getTrendingHashtags } = require("../controllers/hashtag");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/click").post(isAuthenticatedUser, trackHashtagClick);
router.route("/trending").get(getTrendingHashtags);
router.route("/:tag").get(isAuthenticatedUser, getHashtagData);

module.exports = router;
