const express = require("express");
const router = express.Router();

const { globalSearch, autocomplete } = require("../controllers/search");

router.route("/search").get(globalSearch);
router.route("/search/autocomplete").get(autocomplete);

module.exports = router;
