const express = require("express");
const router = express.Router();

const {
    getAllMentors,
    getMentor,
    createMentor,
    updateMentor,
    deleteMentor,
    bookSession,
} = require("../controllers/mentors");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public routes
router.get("/mentors", getAllMentors);
router.get("/mentors/:id", getMentor);

// Authenticated User routes
router.post("/mentors/book", isAuthenticatedUser, bookSession);

// Admin routes
router.post("/mentors", isAuthenticatedUser, authorizeRoles("admin"), createMentor);
router.put("/mentors/:id", isAuthenticatedUser, authorizeRoles("admin"), updateMentor);
router.delete("/mentors/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteMentor);

module.exports = router;
