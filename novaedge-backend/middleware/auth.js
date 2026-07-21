const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticatedUser = async (req, res, next) => {
  console.log("Auth Middleware hit for:", req.originalUrl);
  // 1. Try to grab the token from the cookies or headers
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no token is found, kick them out
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please Login to access this resource",
    });
  }

  try {
    // 3. Decode the token (Read the hidden info inside it)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in the database using the ID from the token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please login again.",
      });
    }

    // 5. Check Session Validity
    if (decoded.sessionId) {
      const Session = require("../models/Session");
      let session = await Session.findById(decoded.sessionId);
      if (!session && req.user) {
        // Recreate session cleanly if missing
        session = await Session.create({
          user: req.user._id,
          ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress || req.ip,
          userAgent: req.headers["user-agent"],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }).catch(() => null);
      }

      if (session && session.isRevoked) {
        return res.status(401).json({
          success: false,
          message: "Session revoked. Please login again.",
        });
      }

      if (session) {
        session.lastActive = Date.now();
        await session.save().catch(() => {});
        req.session = session;
      }
    }

    // 6. Allow them to pass to the next step
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token, please login again",
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const fs = require('fs');
    try {
      fs.writeFileSync('auth_debug.txt', `Roles: ${JSON.stringify(roles)} (${typeof roles})\nUser Role: ${req.user?.role} (${typeof req.user?.role})\nMatch: ${roles.includes(req.user?.role)}\n`);
    } catch (e) { }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized for this resource`,
      });
    }
    next();
  };
};

// Returns 200 with success: false instead of 401 to prevent browser console errors
exports.checkAuthStatus = async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(200).json({ success: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    if (decoded.sessionId) {
      const Session = require("../models/Session");
      let session = await Session.findById(decoded.sessionId);
      if (!session && req.user) {
        session = await Session.create({
          user: req.user._id,
          ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress || req.ip,
          userAgent: req.headers["user-agent"],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }).catch(() => null);
      }
      if (session && session.isRevoked) {
        return res.status(200).json({ success: false, message: "Session revoked" });
      }
      if (session) {
        session.lastActive = Date.now();
        await session.save().catch(() => {});
        req.session = session;
      }
    }

    next();
  } catch (error) {
    return res.status(200).json({ success: false, message: "Invalid Token" });
  }
};
