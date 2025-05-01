const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing admin if exists
        await User.deleteOne({ email: 'admin123@gmail.com' });
        console.log('Removed existing admin user if any');

        // Create new admin user - let the model's pre-save middleware handle password hashing
        const admin = await User.create({
            name: 'Admin',
            email: 'admin123@gmail.com',
            password: 'admin123',  // Plain password - will be hashed by pre-save middleware
            role: 'admin'
        });

        console.log('\nNew Admin User Created:');
        console.log('------------------------');
        console.log('ID:', admin._id);
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);
        console.log('\nYou can now login with:');
        console.log('Email: admin123@gmail.com');
        console.log('Password: admin123');

        // Verify password works
        const verifyUser = await User.findOne({ email: 'admin123@gmail.com' }).select('+password');
        const isMatch = await verifyUser.comparePassword('admin123');
        console.log('\nPassword verification:', isMatch ? 'SUCCESS' : 'FAILED');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

resetAdmin(); 