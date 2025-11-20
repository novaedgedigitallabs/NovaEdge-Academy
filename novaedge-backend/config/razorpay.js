const Razorpay = require("razorpay");

// Create a new instance of Razorpay with your secret keys
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;
