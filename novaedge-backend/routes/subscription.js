const express = require("express");
const router = express.Router();

const {
    getPlans,
    createSubscription,
    verifySubscription,
    cancelSubscription,
    getMySubscription,
    createPlan,
} = require("../controllers/subscription");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public
router.route("/plans").get(getPlans);

// User
router.route("/subscribe").post(isAuthenticatedUser, createSubscription);
router.route("/subscription/verify").post(isAuthenticatedUser, verifySubscription);
router.route("/subscription/cancel").post(isAuthenticatedUser, cancelSubscription);
router.route("/subscription/me").get(isAuthenticatedUser, getMySubscription);

// Admin
router.route("/admin/plans").post(isAuthenticatedUser, authorizeRoles("admin"), createPlan);

module.exports = router;
