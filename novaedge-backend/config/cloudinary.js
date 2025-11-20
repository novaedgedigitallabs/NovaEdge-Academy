const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // console.log('Cloudinary Connected'); // Optional: Check if it works
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectCloudinary;
