const express = require("express");
const router = express.Router();

const {
    getMyReferrals,
    generateReferralCode,
    getAllReferrals,
} = require("../controllers/referral");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// User
router.route("/referrals/me").get(isAuthenticatedUser, getMyReferrals);
router.route("/referral/generate").post(isAuthenticatedUser, generateReferralCode);

// Admin
router.route("/admin/referrals").get(isAuthenticatedUser, authorizeRoles("admin"), getAllReferrals);

module.exports = router;
