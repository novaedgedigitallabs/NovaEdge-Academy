const express = require("express");
const router = express.Router();
const { searchCities } = require("../controllers/city");

router.route("/city/search").get(searchCities);

module.exports = router;
