const express = require('express');
const { 
  registerUser, 
  loginUser, 
  sendUserVerificationEmail, 
  verifyUser, 
  logout, 
  forgotPassword, 
  resetPassword, 
  contactUs, 
  profile, 
  updateProfile, 
  getUsers 
} = require('../controllers/userController');
const catchAsync = require('../utils/CatchAsync');
const { isClient, upload } = require('../middleware');
const router = express.Router();

// Route for user registration
router.post('/register', catchAsync(registerUser));

// Route for user login
router.post('/login', catchAsync(loginUser));

// Route to send verification email
router.post('/sendverificationEmail/:userid', catchAsync(sendUserVerificationEmail));

// Route for email verification (ensure user ID and token are valid)
router.get('/verifyEmail/:userid/:token', catchAsync(verifyUser));

// Route for logout
router.get('/logout', catchAsync(logout));

// Route for forgotten password
router.post('/forgotpassword', catchAsync(forgotPassword));

// Route for password reset page rendering (GET request)
router.get('/resetpassword/:id/:token', (req, res) => {
  const { id, token } = req.params;
  // Add validation for id and token format if needed
  res.render('resetpassword', { id, token });
});

// Route for resetting password (POST request)
router.post('/resetpassword/:id/:token', catchAsync(resetPassword));

// Route for contacting support
router.post('/contact', catchAsync(contactUs));

// Route to get the user profile (only accessible by authenticated clients)
router.get('/profile', isClient, catchAsync(profile));

// Route to update the user profile (only accessible by authenticated clients)
router.post('/updateprofile', isClient, upload.single('photo'), catchAsync(updateProfile));

// Route to get all users (only accessible by authenticated clients)
router.get('/getusers', isClient, catchAsync(getUsers));

module.exports = router;
