const express = require("express");
const router = express.Router();

const { getSession, sendMessage } = require("../controllers/chat");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/chat/session/:courseId").get(isAuthenticatedUser, getSession);
router.route("/chat/:sessionId/message").post(isAuthenticatedUser, sendMessage);

module.exports = router;
