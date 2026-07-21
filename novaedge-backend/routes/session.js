const express = require("express");
const router = express.Router();

const {
    getSessions,
    revokeSession,
    revokeOtherSessions
} = require("../controllers/session");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/sessions").get(isAuthenticatedUser, getSessions);
router.route("/sessions/:id").delete(isAuthenticatedUser, revokeSession);
router.route("/sessions/revoke-others").post(isAuthenticatedUser, revokeOtherSessions);

module.exports = router;
