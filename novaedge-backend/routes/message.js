const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { sendMessage, getMessages } = require("../controllers/message");

router.use(isAuthenticatedUser);

router.route("/send").post(sendMessage);
router.route("/history/:otherUserId").get(getMessages);

module.exports = router;
