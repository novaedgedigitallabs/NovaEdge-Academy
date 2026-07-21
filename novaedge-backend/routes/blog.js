const express = require('express');
const {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/blog');

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router
    .route('/')
    .get(getAllPosts)
    .post(isAuthenticatedUser, authorizeRoles('admin'), createPost);

router
    .route('/:id')
    .get(getPost)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updatePost)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deletePost);

module.exports = router;
