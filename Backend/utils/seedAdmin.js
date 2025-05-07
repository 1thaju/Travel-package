const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Thaju:Thaju%40123@travelpack.1qmsxld.mongodb.net/?retryWrites=true&w=majority&appName=TravelPack';

const seedAdminUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        // Always remove existing admin
        await User.deleteOne({ email: 'admin@travelpackage.com' });

        // Create default admin user
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        await User.create({
            name: 'Admin',
            email: 'admin@travelpackage.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Default admin user created successfully');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin user:', error);
        await mongoose.disconnect();
    }
};

seedAdminUser();