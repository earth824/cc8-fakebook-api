const express = require('express');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/', userController.protect, postController.createPost);

module.exports = router;
