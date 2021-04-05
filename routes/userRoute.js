const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.put('/', userController.protect, userController.updateUser);

module.exports = router;
