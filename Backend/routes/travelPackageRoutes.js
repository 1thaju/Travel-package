const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getAllPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getAnalytics
} = require('../controllers/travelPackageController');

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackage);

// Protected admin routes
router.use(protect);
router.use(authorizeRoles('admin'));

router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);
router.get('/admin/analytics', getAnalytics);

module.exports = router; 