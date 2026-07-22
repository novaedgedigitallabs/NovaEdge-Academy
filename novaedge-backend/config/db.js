const mongoose = require("mongoose");

const seedDefaultUser = async () => {
  try {
    const User = require("../models/User");
    const crypto = require("crypto");

    // 1. Seed / Update Prince Kashyap
    let existingPrince = await User.findOne({ 
      $or: [{ email: "princekashyap2084@gmail.com" }, { username: "princekashyap4563" }] 
    }).select("+password");

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
    } else {
      existingPrince.role = "admin";
      const matches = await existingPrince.matchPassword("Pk8537127");
      if (!matches) {
        existingPrince.password = "Pk8537127";
      }
      await existingPrince.save();
      console.log("Updated default user princekashyap2084@gmail.com to admin role.");
    }

    // 2. Seed / Update Amit Kumar Raikwar
    let existingAmit = await User.findOne({ 
      $or: [{ email: "amitkumarraikwar92@gmail.com" }, { username: "amitkumarraikwar" }] 
    }).select("+password");

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
    } else {
      existingAmit.role = "admin";
      const matches = await existingAmit.matchPassword("Pk8537127");
      if (!matches) {
        existingAmit.password = "Pk8537127";
      }
      await existingAmit.save();
      console.log("Updated default user amitkumarraikwar92@gmail.com to admin role.");
    }
  } catch (err) {
    console.error("Auto-seeding default user error:", err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    await seedDefaultUser();
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultUser();
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      await mongoose.disconnect();
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (MongoMemoryServer): ${conn.connection.host}`);
      await seedDefaultUser();
    } catch (memError) {
      console.error(`MongoDB Connection Error: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
