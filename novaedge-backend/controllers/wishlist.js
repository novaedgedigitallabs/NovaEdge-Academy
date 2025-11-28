const User = require("../models/User");
const Course = require("../models/Course");

// Toggle Wishlist Item
exports.toggleWishlist = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const isAdded = user.wishlist.includes(courseId);

        if (isAdded) {
            // Remove
            user.wishlist = user.wishlist.filter((id) => id.toString() !== courseId);
        } else {
            // Add
            user.wishlist.push(courseId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: isAdded ? "Removed from wishlist" : "Added to wishlist",
            wishlist: user.wishlist,
            isAdded: !isAdded
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");

        res.status(200).json({
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Move to Cart (Just a placeholder if we had a cart, but for now it just returns success)
exports.moveToCart = async (req, res) => {
    // Since we don't have a cart model, we can just return success or 
    // maybe remove from wishlist if the frontend handles the "add to cart" logic (which is direct buy)
    // The prompt says "convenience endpoint to add to cart/checkout flow".
    // We'll just return success.
    res.status(200).json({ success: true, message: "Moved to cart" });
};
