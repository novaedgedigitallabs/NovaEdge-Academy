const Referral = require("../models/Referral");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

// Get My Referral Stats
exports.getMyReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ referrer: req.user.id }).populate("referee", "name email createdAt");
        const walletTransactions = await WalletTransaction.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            referralCode: req.user.referralCode,
            walletBalance: req.user.walletBalance,
            referrals,
            walletTransactions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate/Get Referral Code (Idempotent)
exports.generateReferralCode = async (req, res) => {
    try {
        if (req.user.referralCode) {
            return res.status(200).json({ success: true, referralCode: req.user.referralCode });
        }

        const crypto = require("crypto");
        const code = crypto.randomBytes(4).toString("hex").toUpperCase();

        req.user.referralCode = code;
        await req.user.save();

        res.status(200).json({ success: true, referralCode: code });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get All Referrals
exports.getAllReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find()
            .populate("referrer", "name email")
            .populate("referee", "name email");

        res.status(200).json({ success: true, referrals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
