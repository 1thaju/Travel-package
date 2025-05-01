const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

// Verify environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    console.log('Please create a .env file in the Backend directory with the following content:');
    console.log(`
MONGODB_URI=mongodb://localhost:27017/travel-package
JWT_SECRET=travel-package-secure-jwt-secret-key-2024
JWT_EXPIRE=24h
PORT=5000
FRONTEND_URL=http://localhost:3000
    `);
    process.exit(1);
}

const createAdminUser = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully');

        // Admin user details
        const adminUser = {
            name: 'Admin User',
            email: 'admin@travelpackage.com',
            password: 'Admin@123',
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.disconnect();
            process.exit(0);
        }

        // Create new admin user
        const user = new User(adminUser);
        await user.save();

        console.log('----------------------------------------');
        console.log('Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        console.log('----------------------------------------');
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.name === 'MongoServerError') {
            console.log('\nMake sure MongoDB is running on your machine');
        }
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdminUser(); 