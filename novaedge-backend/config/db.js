const mongoose = require("mongoose");

const seedDefaultUser = async () => {
  try {
    const User = require("../models/User");
    const crypto = require("crypto");

    // 1. Seed Prince Kashyap ONLY if user does not exist
    let existingPrince = await User.findOne({ 
      $or: [{ email: "princekashyap2084@gmail.com" }, { username: "princekashyap4563" }] 
    });

    if (!existingPrince) {
      await User.create({
        name: "Prince Kashyap",
        email: "princekashyap2084@gmail.com",
        username: "princekashyap4563",
        password: "Pk8537127",
        role: "admin",
        avatar: {
          public_id: "avatars/default_avatar_id",
          url: "https://res.cloudinary.com/demo/image/upload/v123456/avatar.jpg",
        },
        referralCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
      });
      console.log("Default user princekashyap2084@gmail.com seeded automatically.");
    }

    // 2. Seed Amit Kumar Raikwar ONLY if user does not exist
    let existingAmit = await User.findOne({ 
      $or: [{ email: "amitkumarraikwar92@gmail.com" }, { username: "amitkumarraikwar" }] 
    });

    if (!existingAmit) {
      await User.create({
        name: "Amit Kumar Raikwar",
        email: "amitkumarraikwar92@gmail.com",
        username: "amitkumarraikwar",
        password: "Pk8537127",
        role: "admin",
        avatar: {
          public_id: "avatars/default_avatar_id",
          url: "https://res.cloudinary.com/demo/image/upload/v123456/avatar.jpg",
        },
        referralCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
      });
      console.log("Default user amitkumarraikwar92@gmail.com seeded automatically.");
    }
  } catch (err) {
    console.error("Auto-seeding default user error:", err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    seedDefaultUser().catch(() => {});
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      await mongoose.disconnect();
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (MongoMemoryServer): ${conn.connection.host}`);
      seedDefaultUser().catch(() => {});
    } catch (memError) {
      console.error(`MongoDB Connection Error: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
