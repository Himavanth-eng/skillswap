
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, isLoggedIn } = require('../utils/authMiddleware');

router.get('/', isLoggedIn, isAdmin, adminController.dashboard);

module.exports = router;