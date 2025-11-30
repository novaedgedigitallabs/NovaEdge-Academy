const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    // 1. Try to connect using the URL from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 2. If successful, show a message in the console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // 3. If it fails, show the error and stop the server
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
