const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../utils/authMiddleware');

router.post('/request/:skillId', isLoggedIn, bookingController.requestBooking);

router.get('/', isLoggedIn, bookingController.list);

router.get('/:id', isLoggedIn, bookingController.view);   // <-- THIS WAS BREAKING

router.post('/:id/accept', isLoggedIn, bookingController.accept);
router.post('/:id/reject', isLoggedIn, bookingController.reject);
router.post('/:id/complete', isLoggedIn, bookingController.complete);
router.post('/:id/cancel', isLoggedIn, bookingController.cancel);

module.exports = router;
