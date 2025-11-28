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
    // We save this user in 'req.user' so we can use it in other files
    req.user = await User.findById(decoded.id);

    // 5. Check Session Validity
    if (decoded.sessionId) {
      const Session = require("../models/Session");
      const session = await Session.findById(decoded.sessionId);
      if (!session || session.isRevoked) {
        return res.status(401).json({
          success: false,
          message: "Session expired or revoked. Please login again.",
        });
      }
      // Update last active
      session.lastActive = Date.now();
      await session.save();
      req.session = session;
    }

    // 5. Allow them to pass to the next step
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
      fs.writeFileSync('auth_debug.txt', `Roles: ${JSON.stringify(roles)} (${typeof roles})\nUser Role: ${req.user.role} (${typeof req.user.role})\nMatch: ${roles.includes(req.user.role)}\n`);
    } catch (e) { }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is SUPER FORBIDDEN`,
      });
    }
    next();
  };
};
