const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// --- 1. REGISTER USER ---
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create the user in the database
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "avatars/default_avatar_id", // Default placeholder
        url: "https://res.cloudinary.com/demo/image/upload/v123456/avatar.jpg",
      },
    });

    // Send the token (Log them in immediately)
    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. LOGIN USER ---
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are entered
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter email and password" });
    }

    // Find user in database (Explicitly ask for password because we set select:false in Model)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Send Token
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. LOGOUT USER ---
exports.logout = async (req, res, next) => {
  // To logout, we set the cookie to null and expire it immediately
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// --- 4. GET CURRENT USER (Profile) ---
exports.getUserProfile = async (req, res, next) => {
  try {
    // req.user comes from the auth middleware we wrote earlier
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- HELPER: SEND TOKEN ---
// This creates the JWT and stores it in a Cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Secure: Prevents client-side JS from reading the cookie
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
