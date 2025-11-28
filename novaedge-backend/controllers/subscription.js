const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const instance = require("../config/razorpay");
const crypto = require("crypto");

// Get All Plans
exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true });
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Subscription (Step 1: Get Link/ID)
exports.createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

        // Create Subscription on Razorpay
        const options = {
            plan_id: plan.razorpay_plan_id,
            total_count: 120, // Max cycles (10 years)
            quantity: 1,
            customer_notify: 1,
            notes: {
                userId: req.user.id,
                planId: plan._id.toString(),
            },
        };

        const rzpSub = await instance.subscriptions.create(options);

        // Save to DB
        const subscription = await Subscription.create({
            user: req.user.id,
            plan: plan._id,
            razorpay_subscription_id: rzpSub.id,
            status: rzpSub.status,
        });

        res.status(201).json({ success: true, subscription_id: rzpSub.id, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Subscription (Step 2: After Payment)
exports.verifySubscription = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Update DB
            const subscription = await Subscription.findOne({ razorpay_subscription_id });
            if (subscription) {
                subscription.status = "active";
                // Fetch details from Razorpay to get start/end dates
                const rzpSub = await instance.subscriptions.fetch(razorpay_subscription_id);
                subscription.current_start = new Date(rzpSub.current_start * 1000);
                subscription.current_end = new Date(rzpSub.current_end * 1000);
                await subscription.save();
            }

            res.status(200).json({ success: true, message: "Subscription verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id, status: "active" });
        if (!subscription) return res.status(404).json({ success: false, message: "No active subscription" });

        // Cancel on Razorpay (at end of cycle)
        await instance.subscriptions.cancel(subscription.razorpay_subscription_id, false);

        subscription.cancel_at_period_end = true;
        // Note: Status remains 'active' until webhook confirms 'cancelled' or 'completed'
        await subscription.save();

        res.status(200).json({ success: true, message: "Subscription will cancel at end of period" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get My Subscription
exports.getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user.id })
            .populate("plan")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Plan (Admin) - Helper to create on Razorpay too
exports.createPlan = async (req, res) => {
    try {
        const { name, price, interval, description } = req.body;

        // Create on Razorpay
        const rzpPlan = await instance.plans.create({
            period: interval, // "monthly" or "yearly"
            interval: 1,
            item: {
                name: name,
                amount: price * 100,
                currency: "INR",
                description: description,
            },
        });

        const plan = await Plan.create({
            name,
            price,
            interval,
            description,
            razorpay_plan_id: rzpPlan.id,
        });

        res.status(201).json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
