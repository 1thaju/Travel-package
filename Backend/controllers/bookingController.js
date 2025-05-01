const Booking = require('../models/Booking');
const TravelPackage = require('../models/TravelPackage');
const User = require('../models/User');

// Create new booking
const createBooking = async (req, res) => {
    try {
        const { packageId, selectedServices, numberOfTravelers, specialRequests } = req.body;

        // Check if package exists and has availability
        const travelPackage = await TravelPackage.findById(packageId);
        if (!travelPackage) {
            return res.status(404).json({
                success: false,
                message: 'Travel package not found'
            });
        }

        // Check availability
        if (!travelPackage.isAvailable()) {
            return res.status(400).json({
                success: false,
                message: 'Package is fully booked'
            });
        }

        // Calculate total price
        const duration = Math.ceil((travelPackage.endDate - travelPackage.startDate) / (1000 * 60 * 60 * 24));
        let totalPrice = travelPackage.basePrice * numberOfTravelers;

        if (selectedServices.food && travelPackage.includedServices.food.available) {
            totalPrice += travelPackage.includedServices.food.pricePerDay * duration * numberOfTravelers;
        }

        if (selectedServices.accommodation && travelPackage.includedServices.accommodation.available) {
            totalPrice += travelPackage.includedServices.accommodation.pricePerDay * duration * numberOfTravelers;
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            package: packageId,
            selectedServices,
            totalPrice,
            numberOfTravelers,
            specialRequests
        });

        // Update package's current bookings
        await TravelPackage.findByIdAndUpdate(packageId, {
            $inc: { currentBookings: numberOfTravelers }
        });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('package', 'from to startDate endDate basePrice');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('package', 'from to startDate endDate basePrice');

        // Calculate current status for each booking
        const bookingsWithStatus = bookings.map(booking => {
            const status = booking.calculateStatus(
                booking.package.startDate,
                booking.package.endDate
            );
            return {
                ...booking.toObject(),
                currentStatus: status
            };
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookingsWithStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single booking
const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('package', 'from to startDate endDate basePrice');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is authorized to view this booking
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is authorized to cancel this booking
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking can be cancelled (not already started)
        const package = await TravelPackage.findById(booking.package);
        if (new Date() >= package.startDate) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel a booking that has already started'
            });
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Update package's current bookings
        await TravelPackage.findByIdAndUpdate(booking.package, {
            $inc: { currentBookings: -booking.numberOfTravelers }
        });

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get booking analytics (admin only)
const getBookingAnalytics = async (req, res) => {
    try {
        const analytics = {
            totalBookings: await Booking.countDocuments(),
            totalRevenue: await Booking.aggregate([
                { $match: { status: { $ne: 'Cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            bookingsByStatus: await Booking.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            popularPackages: await Booking.aggregate([
                { $group: { 
                    _id: '$package',
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }},
                { $sort: { bookings: -1 } },
                { $limit: 5 },
                { $lookup: {
                    from: 'travelpackages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'packageDetails'
                }}
            ])
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

// Get all users with their bookings (Admin only)
const getAllUsersBookings = async (req, res) => {
    try {
        const usersWithBookings = await User.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'bookings'
                }
            },
            {
                $lookup: {
                    from: 'travelpackages',
                    localField: 'bookings.package',
                    foreignField: '_id',
                    as: 'packageDetails'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    bookings: {
                        $map: {
                            input: '$bookings',
                            as: 'booking',
                            in: {
                                _id: '$$booking._id',
                                status: '$$booking.status',
                                totalPrice: '$$booking.totalPrice',
                                includedServices: '$$booking.includedServices',
                                bookingDate: '$$booking.bookingDate',
                                package: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$packageDetails',
                                                as: 'package',
                                                cond: { $eq: ['$$package._id', '$$booking.package'] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    },
                    bookingCount: { $size: '$bookings' }
                }
            }
        ]);

        res.status(200).json(usersWithBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users bookings', error: error.message });
    }
};

// Get booking statistics (Admin only)
const getBookingStats = async (req, res) => {
    try {
        const currentDate = new Date();
        
        const bookingStats = await TravelPackage.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'package',
                    as: 'bookings'
                }
            },
            {
                $project: {
                    from: 1,
                    to: 1,
                    startDate: 1,
                    endDate: 1,
                    basePrice: 1,
                    totalBookings: { $size: '$bookings' },
                    status: {
                        $cond: {
                            if: { $gt: ['$startDate', currentDate] },
                            then: 'Upcoming',
                            else: {
                                $cond: {
                                    if: { $lt: ['$endDate', currentDate] },
                                    then: 'Completed',
                                    else: 'Active'
                                }
                            }
                        }
                    },
                    bookingsByStatus: {
                        accepted: {
                            $size: {
                                $filter: {
                                    input: '$bookings',
                                    as: 'booking',
                                    cond: { $eq: ['$$booking.status', 'Accepted'] }
                                }
                            }
                        },
                        cancelled: {
                            $size: {
                                $filter: {
                                    input: '$bookings',
                                    as: 'booking',
                                    cond: { $eq: ['$$booking.status', 'Cancelled'] }
                                }
                            }
                        }
                    },
                    revenue: {
                        $sum: '$bookings.totalPrice'
                    }
                }
            },
            {
                $sort: { startDate: 1 }
            }
        ]);

        // Group packages by status
        const packagesByStatus = {
            Upcoming: bookingStats.filter(pkg => pkg.status === 'Upcoming'),
            Active: bookingStats.filter(pkg => pkg.status === 'Active'),
            Completed: bookingStats.filter(pkg => pkg.status === 'Completed')
        };

        res.status(200).json({
            totalPackages: bookingStats.length,
            packagesByStatus,
            detailedStats: bookingStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking statistics', error: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking,
    getAllUsersBookings,
    getBookingStats,
    getBookingAnalytics
}; 