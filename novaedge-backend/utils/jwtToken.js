const Session = require("../models/Session");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

const sendToken = async (user, statusCode, res, req) => {
    // 1. Parse Metadata
    const ua = UAParser(req.headers["user-agent"]);
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const geo = geoip.lookup(ip);

    const cookieDays = parseInt(process.env.COOKIE_EXPIRE || "30", 10);
    const expiresMs = (isNaN(cookieDays) ? 30 : cookieDays) * 24 * 60 * 60 * 1000;

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
        expiresAt: new Date(Date.now() + expiresMs),
    });

    // 3. Generate Token with Session ID
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
        { id: user._id, sessionId: session._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + expiresMs),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
