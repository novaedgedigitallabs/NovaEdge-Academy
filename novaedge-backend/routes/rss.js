const express = require("express");
const router = express.Router();
const { getRssFeed, triggerRssAutoPush } = require("../controllers/rss");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Public RSS 2.0 Feed
router.get("/feed.xml", getRssFeed);

// Admin / Trigger Auto Push for RSS Content
router.post(
  "/trigger-push",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  triggerRssAutoPush
);

module.exports = router;
