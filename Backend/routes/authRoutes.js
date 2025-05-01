// authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, getMe, adminLogin } = require('../controllers/authController');  
const { isAuthenticatedUser } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuthenticatedUser, getMe);  // Protected route for getting user profile
router.post('/admin-login', adminLogin);  // Admin login route

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = req.user.getJwtToken();
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

module.exports = router;
