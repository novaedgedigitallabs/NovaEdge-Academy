const express = require('express');
const {
    getAllMentors,
    getMentor,
    createMentor,
    updateMentor,
    deleteMentor
} = require('../controllers/mentor');

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router
    .route('/')
    .get(getAllMentors)
    .post(isAuthenticatedUser, authorizeRoles('admin'), createMentor);

router
    .route('/:id')
    .get(getMentor)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateMentor)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteMentor);

module.exports = router;
