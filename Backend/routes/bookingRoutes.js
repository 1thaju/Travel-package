const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking,
    getBookingAnalytics
} = require('../controllers/bookingController');

// Protected routes for all authenticated users
router.use(protect);

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Protected admin routes
router.use(authorizeRoles('admin'));

router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);
router.get('/admin/analytics', getBookingAnalytics);

module.exports = router; 