const express = require("express");
const {
    getBadges,
    getMyBadges,
    createBadge,
    updateBadge,
    awardBadgeManually,
} = require("../controllers/badges");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Public/User Routes
router.route("/").get(getBadges);
router.route("/me").get(isAuthenticatedUser, getMyBadges);

// Admin Routes
router.use("/admin", isAuthenticatedUser, authorizeRoles("admin"));

router.route("/admin").post(createBadge);
router.route("/admin/:id").put(updateBadge);
router.route("/admin/:id/award").post(awardBadgeManually);

module.exports = router;
