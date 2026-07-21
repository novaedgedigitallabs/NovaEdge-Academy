// This function takes a list of allowed roles (e.g., 'admin')
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the logged-in user's role is in the allowed list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }

    // If they are an admin, let them pass
    next();
  };
};
