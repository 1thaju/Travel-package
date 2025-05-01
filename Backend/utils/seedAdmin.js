const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin123@gmail.com' });
        
        if (!adminExists) {
            // Create default admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await User.create({
                name: 'Admin',
                email: 'admin123@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            
            console.log('Default admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdminUser; 