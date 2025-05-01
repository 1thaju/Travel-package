const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const getAdminInfo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin123@gmail.com' });
        if (admin) {
            console.log('\nAdmin User Information:');
            console.log('------------------------');
            console.log('ID:', admin._id);
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('Created At:', admin.createdAt);
        } else {
            console.log('Admin user not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

// Run the function
getAdminInfo(); 