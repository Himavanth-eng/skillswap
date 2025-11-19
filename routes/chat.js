const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { isLoggedIn } = require('../utils/authMiddleware');

router.get('/:bookingId', isLoggedIn, chatController.viewChat);
router.post('/:bookingId', isLoggedIn, chatController.sendMessage);

module.exports = router;