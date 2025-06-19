// authController.js
const User = require('../models/User');  // Ensure you have the User model imported
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register user
const register = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase().trim();
        const { password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        // Do NOT hash password here; let the pre-save hook handle it
        const user = await User.create({ email, password, name });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase().trim();
        const { password } = req.body;
        
        console.log('Login attempt for email:', email);
        console.log('Request body:', req.body);
        
        // First check if user exists without password
        const userExists = await User.findOne({ email });
        console.log('User exists check:', userExists ? 'Yes' : 'No');
        
        // Then get user with password
        const user = await User.findOne({ email }).select('+password');
        console.log('User found with password:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log('User found, comparing passwords');
        console.log('Stored password hash:', user.password);
        console.log('Attempting to compare with provided password');
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log('Login successful for user:', email);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: 'Server error during login',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Get current user profile
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // Assuming `req.user` is populated after authentication
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and is admin
        const user = await User.findOne({ email }).select('+password');
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or not an admin'
            });
        }
        console.log('Admin login email:', email);
        console.log('Found user:', user);
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token for admin
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    adminLogin
};
