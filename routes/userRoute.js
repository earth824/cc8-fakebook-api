const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', userController.protect, userController.me);
router.put('/', userController.protect, userController.updateUser);

module.exports = router;
