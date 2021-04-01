const express = require('express');
const friendController = require('../controllers/friendController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/request-list', userController.protect, friendController.requestList);
router.post('/', userController.protect, friendController.requestFriend);

module.exports = router;
