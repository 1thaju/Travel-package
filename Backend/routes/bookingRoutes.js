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
    getBookingAnalytics,
    getAllUsersBookings,
    getBookingStats
} = require('../controllers/bookingController');
const { isAuthenticatedUser } = require('../middleware/auth');

// Protected routes for all authenticated users
router.use(protect);

router.post('/', isAuthenticatedUser, createBooking);
router.get('/my', isAuthenticatedUser, getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Protected admin routes
router.use(authorizeRoles('admin'));

router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);
router.get('/admin/analytics', getBookingAnalytics);
router.get('/admin/users-bookings', getAllUsersBookings);
router.get('/admin/package-stats', getBookingStats);

module.exports = router; 