const express = require("express");
const { generateLectureResources } = require("../controllers/ai");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/generate-resources").post(isAuthenticatedUser, generateLectureResources);

module.exports = router;
