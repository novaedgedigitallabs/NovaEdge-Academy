const express = require("express");
const router = express.Router();

const {
    enroll2FA,
    verify2FA,
    login2FA,
    disable2FA,
    get2FAStatus
} = require("../controllers/twoFactor");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/auth/2fa/enroll").post(isAuthenticatedUser, enroll2FA);
router.route("/auth/2fa/verify").post(isAuthenticatedUser, verify2FA);
router.route("/auth/2fa/login").post(login2FA); // Public (requires temp token)
router.route("/auth/2fa/disable").post(isAuthenticatedUser, disable2FA);
router.route("/auth/2fa/status").get(isAuthenticatedUser, get2FAStatus);

module.exports = router;
