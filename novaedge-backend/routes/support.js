const express = require("express");
const {
    createTicket,
    getTickets,
    getTicket,
    addComment,
    updateTicket,
    getQueues,
    createQueue,
} = require("../controllers/support");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.use(isAuthenticatedUser);

router
    .route("/tickets")
    .post(createTicket)
    .get(authorizeRoles("agent", "admin"), getTickets);

router
    .route("/tickets/:id")
    .get(getTicket)
    .put(authorizeRoles("agent", "admin"), updateTicket);

router.route("/tickets/:id/comments").post(addComment);

router
    .route("/queues")
    .get(authorizeRoles("agent", "admin"), getQueues)
    .post(authorizeRoles("admin"), createQueue);

module.exports = router;
