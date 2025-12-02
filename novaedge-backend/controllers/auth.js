const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");

// --- 1. REGISTER USER ---
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, referralCode, username, phoneNumber } = req.body;

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Generate unique referral code for new user
    const newReferralCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create the user in the database
    const user = await User.create({
      name,
      email,
      password,
      username,
      phoneNumber,
      avatar: {
        public_id: "avatars/default_avatar_id", // Default placeholder
        url: "https://res.cloudinary.com/demo/image/upload/v123456/avatar.jpg",
      },
      referralCode: newReferralCode,
      referredBy,
    });

    // If referred, create Referral record
    if (referredBy) {
      const Referral = require("../models/Referral");
      await Referral.create({
        referrer: referredBy,
        referee: user._id,
        status: "pending",
      });
    }

    // Send the token (Log them in immediately)
    await sendToken(user, 201, res, req);
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

    // 2FA Check
    if (user.twoFactor && user.twoFactor.enabled) {
      const tempToken = jwt.sign({ id: user._id, temp: true }, process.env.JWT_SECRET, { expiresIn: "10m" });

      return res.status(200).json({
        success: true,
        require2fa: true,
        tempToken
      });
    }

    // Send Token
    await sendToken(user, 200, res, req);
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
// --- 5. GET PUBLIC PROFILE (Shareable) ---
// --- 5. GET PUBLIC PROFILE (Shareable) ---
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let query = {};
    const mongoose = require("mongoose");

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { username: id };
    }

    // Select all fields except password, twoFactor secret, and reset token
    const user = await User.findOne(query).select("-password -twoFactor.secret -twoFactor.tempSecret -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch Certificates
    const Certificate = require("../models/Certificate");
    const certificates = await Certificate.find({ user: user._id }).populate("course", "title poster");

    res.status(200).json({
      success: true,
      user,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// --- 6. UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
    };

    // Update Avatar
    if (req.body.avatar && req.body.avatar !== "") {
      const user = await User.findById(req.user.id);
      const cloudinary = require("cloudinary").v2;

      const imageId = user.avatar.public_id;

      // Delete old avatar if it's not the default one
      if (imageId !== "avatars/default_avatar_id") {
        await cloudinary.uploader.destroy(imageId);
      }

      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 7. LOOKUP USER (By Username or Phone) ---
exports.lookupUser = async (req, res) => {
  try {
    const { username, phone } = req.query;
    let query = {};

    if (username) {
      query.username = username;
    } else if (phone) {
      query.phoneNumber = phone;
    } else {
      return res.status(400).json({ success: false, message: "Please provide username or phone" });
    }

    const user = await User.findOne(query).select("_id name username avatar");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
