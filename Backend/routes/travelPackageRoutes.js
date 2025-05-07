const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getAllPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getAnalytics,
    getPackageStatusAndBookingCount
} = require('../controllers/travelPackageController');
const { isAuthenticatedUser } = require('../middleware/auth');

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    return res.status(403).json({ message: 'Admin access required' });
};

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackage);

// Admin-only routes
router.post('/', isAuthenticatedUser, admin, createPackage);
router.put('/:id', isAuthenticatedUser, admin, updatePackage);
router.delete('/:id', isAuthenticatedUser, admin, deletePackage);
router.get('/admin/analytics', isAuthenticatedUser, admin, getAnalytics);
router.get('/admin/status-booking-count', isAuthenticatedUser, admin, getPackageStatusAndBookingCount);

module.exports = router; 