require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');


// Import Passport config
require('./config/passport');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection details:', {
        uri: process.env.MONGODB_URI ? 'URI is set' : 'URI is missing',
        error: err.message,
        code: err.code,
        name: err.name
    });
    process.exit(1); // Exit if we can't connect to the database
});

// Add connection error handler
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const travelPackageRoutes = require('./routes/travelPackageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/travel-packages', travelPackageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Travel Package API' });
});

// Catch-all 404 for API routes
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;
console.log('MONGODB_URI:', process.env.MONGODB_URI);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 