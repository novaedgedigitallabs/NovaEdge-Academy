const express = require('express');
const {
    getAllPositions,
    getPosition,
    createPosition,
    updatePosition,
    deletePosition
} = require('../controllers/career');

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router
    .route('/')
    .get(getAllPositions)
    .post(isAuthenticatedUser, authorizeRoles('admin'), createPosition);

router
    .route('/:id')
    .get(getPosition)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updatePosition)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deletePosition);

module.exports = router;
