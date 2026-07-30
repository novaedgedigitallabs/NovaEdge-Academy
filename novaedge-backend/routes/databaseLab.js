const express = require("express");
const router = express.Router();
const {
  runAcidDemo,
  runIndexDemo,
  runCapDemo,
  runNormalizationDemo,
} = require("../controllers/databaseLab");

router.post("/acid-demo", runAcidDemo);
router.post("/index-demo", runIndexDemo);
router.post("/cap-demo", runCapDemo);
router.post("/normalization-demo", runNormalizationDemo);

module.exports = router;
