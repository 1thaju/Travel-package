const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelPackage',
        required: true
    },
    selectedServices: {
        food: {
            type: Boolean,
            default: false
        },
        accommodation: {
            type: Boolean,
            default: false
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Accepted'],
        default: 'Accepted'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    numberOfTravelers: {
        type: Number,
        required: true,
        min: [1, 'At least one traveler is required']
    },
    specialRequests: {
        type: String
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add method to calculate booking status based on package dates
bookingSchema.methods.calculateStatus = function(packageStartDate, packageEndDate) {
    const currentDate = new Date();
    
    if (currentDate < packageStartDate) {
        return 'Upcoming';
    } else if (currentDate >= packageStartDate && currentDate <= packageEndDate) {
        return 'Active';
    } else {
        return 'Completed';
    }
};

// Add virtual field for duration
bookingSchema.virtual('duration').get(function() {
    return Math.ceil((this.package.endDate - this.package.startDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to ensure booking dates are within package dates
bookingSchema.pre('save', async function(next) {
    try {
        const package = await mongoose.model('TravelPackage').findById(this.package);
        if (!package) {
            throw new Error('Travel package not found');
        }

        // Validate booking date is before package start date
        if (this.bookingDate > package.startDate) {
            throw new Error('Booking must be made before the package start date');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
 