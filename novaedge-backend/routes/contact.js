const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contact");

// Submit Contact Form
// URL: /api/v1/contact
router.route("/contact").post(submitContact);

module.exports = router;
