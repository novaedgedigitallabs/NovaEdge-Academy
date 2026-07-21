const express = require("express");
const {
    getAuditLogs,
    getAuditLog,
    retractAuditLog,
} = require("../controllers/audit");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.use(isAuthenticatedUser);
router.use(authorizeRoles("admin"));

router.route("/").get(getAuditLogs);
router.route("/:id").get(getAuditLog);
router.route("/:id/retract").post(retractAuditLog);

module.exports = router;
