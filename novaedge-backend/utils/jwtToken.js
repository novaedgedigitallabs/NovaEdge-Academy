const Session = require("../models/Session");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

const sendToken = async (user, statusCode, res, req) => {
    // 1. Parse Metadata
    const ua = UAParser(req.headers["user-agent"]);
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const geo = geoip.lookup(ip);

    // 2. Create Session
    const session = await Session.create({
        user: user._id,
        ip,
        userAgent: req.headers["user-agent"],
        browser: ua.browser.name,
        os: ua.os.name,
        device: ua.device.type || "desktop",
        location: {
            city: geo ? geo.city : "Unknown",
            country: geo ? geo.country : "Unknown",
        },
        expiresAt: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    });

    // 3. Generate Token with Session ID
    // Note: We need to modify user.getSignedJwtToken to accept sessionId or do it manually here.
    // For cleaner code, I'll manually sign here or update the model method. 
    // Let's manually sign here to avoid changing the model signature everywhere if not needed.
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
        { id: user._id, sessionId: session._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Secure: Prevents client-side JS from reading the cookie
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-origin
        secure: process.env.NODE_ENV === 'production', // Required for sameSite=none
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
