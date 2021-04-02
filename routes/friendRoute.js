const express = require('express');
const friendController = require('../controllers/friendController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/request-list', userController.protect, friendController.requestList);
router.post('/', userController.protect, friendController.requestFriend);
router.patch('/:id', userController.protect, friendController.updateStatus);

module.exports = router;
