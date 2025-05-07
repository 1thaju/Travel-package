const TravelPackage = require('../models/TravelPackage');
const Booking = require('../models/Booking');

// Get all travel packages with filters
const getAllPackages = async (req, res) => {
    try {
        const { from, to, startDate, endDate, minPrice, maxPrice, sort } = req.query;
        const query = {};

        // Apply filters
        if (from) query.from = new RegExp(from, 'i');
        if (to) query.to = new RegExp(to, 'i');
        if (startDate) query.startDate = { $gte: new Date(startDate) };
        if (endDate) query.endDate = { $lte: new Date(endDate) };
        if (minPrice) query.basePrice = { $gte: Number(minPrice) };
        if (maxPrice) query.basePrice = { ...query.basePrice, $lte: Number(maxPrice) };

        // Create sort object
        let sortObj = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortObj[field] = order === 'desc' ? -1 : 1;
        } else {
            sortObj = { createdAt: -1 };
        }

        const packages = await TravelPackage.find(query).sort(sortObj);

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single travel package
const getPackage = async (req, res) => {
    try {
        const package = await TravelPackage.findById(req.params.id);
        
        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            data: package
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new travel package
const createPackage = async (req, res) => {
    try {
        // Validate dates
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        if (endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const package = await TravelPackage.create(req.body);

        res.status(201).json({
            success: true,
            data: package
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update travel package
const updatePackage = async (req, res) => {
    try {
        const package = await TravelPackage.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        // Validate dates if they're being updated
        if (req.body.startDate && req.body.endDate) {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            if (endDate <= startDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        const updatedPackage = await TravelPackage.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: updatedPackage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete travel package
const deletePackage = async (req, res) => {
    try {
        const package = await TravelPackage.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        await package.remove();

        res.status(200).json({
            success: true,
            message: 'Package deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get analytics for admin
const getAnalytics = async (req, res) => {
    try {
        const packages = await TravelPackage.find();
        const analytics = {
            totalPackages: packages.length,
            availablePackages: packages.filter(p => p.isAvailable()).length,
            popularDestinations: await TravelPackage.aggregate([
                { $group: { _id: '$to', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            priceRanges: {
                budget: await TravelPackage.countDocuments({ basePrice: { $lt: 1000 } }),
                medium: await TravelPackage.countDocuments({ basePrice: { $gte: 1000, $lt: 2000 } }),
                luxury: await TravelPackage.countDocuments({ basePrice: { $gte: 2000 } })
            }
        };

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin analytics: Get package status and booking count per package
const getPackageStatusAndBookingCount = async (req, res) => {
    try {
        const today = new Date();
        const packages = await TravelPackage.find();
        const result = await Promise.all(packages.map(async pkg => {
            let status = '';
            if (pkg.endDate < today) status = 'Completed';
            else if (pkg.startDate > today) status = 'Upcoming';
            else status = 'Active';
            const bookingCount = await Booking.countDocuments({ package: pkg._id });
            return { ...pkg.toObject(), status, bookingCount };
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getAnalytics,
    getPackageStatusAndBookingCount
}; 