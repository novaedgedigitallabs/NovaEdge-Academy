const express = require("express");
const router = express.Router();

const {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
} = require("../controllers/coupon");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/User
router.route("/coupons/validate").post(isAuthenticatedUser, validateCoupon);

// Admin
router.route("/admin/coupons").get(isAuthenticatedUser, authorizeRoles("admin"), getCoupons).post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);
router.route("/admin/coupons/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

module.exports = router;
