const router = require('express').Router();
const user  = require('../controllers/userController');
const catchAsync = require('../utils/CatchAsync');
const { isClient, upload } = require('../middleware.js');


router.route('/sendProfileDetails')
    .get(isClient,catchAsync(user.profile));
    
router.route('/login')
    .post(catchAsync(user.login));
    
    
router.route('/register')
    .post(catchAsync(user.register));

router.route('/sendverificationEmail/:userid')
    .post(catchAsync(user.sendUserVerificationEmail));

router.route('/verifyEmail/:userid/:token')
    .get(catchAsync(user.verifyUser));


router.route('/logout')
    .get(user.logout);


router.route('/forgotpassword')
    .post(catchAsync(user.forgotPassword));

router.route('/resetpassword/:id/:token')
    .get((req, res) => {
        const { id, token } = req.params;
        res.render('resetpassword', { id, token });
    })
    .post(catchAsync(user.resetPassword));

router.route('/contact')
    .post(catchAsync(user.contactUs));

router.route('/profile')
    .get(isClient,catchAsync(user.profile));

router.route('/updateprofile')
    .post(isClient, upload.single('photo'), catchAsync(user.updateProfile));

router.route('/getusers')
    .get(isClient,catchAsync(user.getUsers));

module.exports = router;