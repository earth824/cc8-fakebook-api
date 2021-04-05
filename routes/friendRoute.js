const express = require('express');
const friendController = require('../controllers/friendController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.protect, friendController.getAllFriends);
router.get('/request-list', userController.protect, friendController.requestList);
router.post('/', userController.protect, friendController.requestFriend);
router.patch('/:id', userController.protect, friendController.updateStatus);
router.delete('/:id', userController.protect, friendController.deleteFriend);

module.exports = router;
