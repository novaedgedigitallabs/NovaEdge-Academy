const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticatedUser = async (req, res, next) => {
  // 1. Try to grab the token from the cookies
  const { token } = req.cookies;

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
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};
