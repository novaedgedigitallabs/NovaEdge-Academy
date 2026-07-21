const express = require("express");
const router = express.Router();

const {
    toggleWishlist,
    getWishlist,
    moveToCart,
} = require("../controllers/wishlist");

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/wishlist").get(isAuthenticatedUser, getWishlist);
router.route("/wishlist/:courseId/toggle").post(isAuthenticatedUser, toggleWishlist);
router.route("/wishlist/move-to-cart/:courseId").post(isAuthenticatedUser, moveToCart);

module.exports = router;
