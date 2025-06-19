// authRoutes.js

const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, getMe, adminLogin } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

console.log('register:', typeof register);
console.log('login:', typeof login);
console.log('getMe:', typeof getMe);
console.log('adminLogin:', typeof adminLogin);
console.log('isAuthenticatedUser:', typeof isAuthenticatedUser);
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

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

module.exports = router;
