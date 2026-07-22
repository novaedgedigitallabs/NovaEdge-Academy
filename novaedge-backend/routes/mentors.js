const express = require("express");
const router = express.Router();

const {
    getAllMentors,
    getMentor,
    createMentor,
    updateMentor,
    deleteMentor,
    bookSession,
    getMyBookings,
} = require("../controllers/mentors");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public routes
router.get("/mentors", getAllMentors);

// Authenticated User routes
router.get("/mentors/my-bookings", isAuthenticatedUser, getMyBookings);
router.post("/mentors/book", isAuthenticatedUser, bookSession);
router.get("/mentors/:id", getMentor);

// Admin routes
router.post("/mentors", isAuthenticatedUser, authorizeRoles("admin"), createMentor);
router.put("/mentors/:id", isAuthenticatedUser, authorizeRoles("admin"), updateMentor);
router.delete("/mentors/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteMentor);

module.exports = router;
