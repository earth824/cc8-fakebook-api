const express = require('express');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.protect, postController.getAllPosts);
router.get('/inc-friend', userController.protect, postController.getAllPostsIncludeFriend);
router.post('/', userController.protect, postController.createPost);
router.delete('/:id', userController.protect, postController.deletePost);

module.exports = router;
