const mongoose = require('mongoose');

const travelPackageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        trim: true
    },
    to: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    includedServices: {
        food: {
            type: Boolean,
            default: false
        },
        accommodation: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Add validation for endDate to be after startDate
travelPackageSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

module.exports = mongoose.model('TravelPackage', travelPackageSchema); 