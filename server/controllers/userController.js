const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const ExpressError = require('../utils/ExpressError');
const mailSender = require('../utils/mailSender');
const uploadOnCloudinary = require('../utils/cloudinary');
const cloudinary = require('cloudinary').v2;


module.exports.login = async (req, res) => {
    console.log("Inside login");
    let { email, password } = req.body;
    if (!email || !password) throw new ExpressError('missing fields', 400);
    else {
        email = email.toLowerCase();
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new ExpressError('invalid credentials', 400);
        }
 
        if (!bcrypt.compareSync(password, user.password)) {
            throw new ExpressError('invalid credentials password', 400);
        }
        const token = jwt.sign({ id: user._id }, process.env.USER_SECRET, { expiresIn: '3h'});
        res.cookie('userjwt', {token : token, expiresIn: new Date(Date.now() + 3 * 60 * 60 * 1000)}, { signed: true, httpOnly: true, sameSite: 'none', maxAge: 1000 * 60 * 60 * 3, secure: true })
        // res.cookie('userjwt', {token : token, expiresIn: new Date(Date.now() + 3 * 60 * 60 * 1000)}, { signed: true, maxAge: 1000 * 60 * 60 * 3, httpOnly: true});    
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            googleId: user.googleId,
            profile: user.profile,      
            registeredQuizzes: user.registeredQuizzes      
        }
        console.log(payload);
        res.status(200).json({ payload, expiresIn: new Date(Date.now() + 3 * 60 * 60 * 1000)});
    }
}

module.exports.register = async (req, res) => {
    let { name, email, password, referralcode } = req.body;
    if (!name || !email || !password) throw new ExpressError('missing fields', 400);
    email = email.toLowerCase();
    const registeredEmail = await User.findOne({email: email});

    if (registeredEmail) {
        throw new ExpressError('email already registered', 400);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // checking for referral code from user
    const referralCode = referralcode;
    if(referralCode != ''){
        const referrerExists = await Profile.findOne({
            referralCodeString:referralCode
        });
        if(referrerExists){
            let userCountIncreased = 1;
            let coinsIncreased = 1;
            const referredUser = await Profile.findOneAndUpdate({referralCodeString:referralCode},
                {$inc :{totalUsersReferred:userCountIncreased, coin:coinsIncreased}},{new:true});
        }
    }

    // made changes to username, now its pretty much unique, name+[5]+"@Geeky"+[2], these are alot of combinations
    const username = generateUsername(name);
    const user = await User.create({ name,username, email, password: hash });
    
    //Creating Profile
    const referralCodeString = randomStringGenerator.generate(7).toUpperCase();
    const profile = await Profile.create({
        userId: user._id,
        referralCodeString:referralCodeString,
    });

    await profile.save();
    user.profile = profile._id;

    await user.save();
    await sendVerificationEmail(email,user);
    res.status(200).json('register');

}


module.exports.logout = (req, res) => {
    console.log("In Logout");
    res.clearCookie('userjwt', {
        signed: true,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.status(200).json('logout');
};


module.exports.forgotPassword = async (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email: email });
    if (user) {
        const secret = `${process.env.USER_SECRET}${user.password}`;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '5m' });

        let config = {
            host: 'smtp.hostinger.com', // Hostinger SMTP server
            port: 465, // Port for secure SMTP
            secure: true, // True for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // Hostinger email user
                pass: process.env.PASSWORD // Hostinger email password
            }
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Geek Clash',
                link: process.env.SITE_URL,
                copyright: 'Copyright © 2024 Geek Clash. All rights reserved.',
            },
            logo: 'https://res.cloudinary.com/dwnw77ubt/image/upload/v1720155961/fav_ky1c7f.png'
    
        });

        var response = {
            body: {
                name: `${user.username}`,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#5cd7d1',
                        text: 'Click here',
                        link: `${process.env.BACKEND_DOMAIN}/user/resetpassword/${user._id}/${token}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        var emailBody = MailGenerator.generate(response);
        let message = {
            from: `${process.env.EMAIL}`,
            to: `${email}`,
            subject: 'Password Reset Request',
            html: emailBody
        };

        transporter.sendMail(message)
            .then(() => res.status(201).json('email sent'))
            .catch((err) => res.status(400).json(err));

    }
    else {
        res.status(400).json('email not registered');
    }
}



module.exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    const oldUser = await User.findById(id);
    const redirectUrl = `${process.env.SITE_URL}/login`;
    if(!oldUser){
        res.status(400).json('user not found');
    }
    else{
        const secret = `${process.env.USER_SECRET}${oldUser.password}`;
        if(jwt.verify(token,secret)){
            oldUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            await oldUser.save();
            res.render('successfulReset.ejs', {redirectUrl});
        }
        else{
            res.status(400).json('invalid token');
        }
    }
}



module.exports.sendUserVerificationEmail = async (req, res) => {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid });

    if (!user) {
        throw new ExpressError('user not found', 400);
    }

    if (user.verified) {
        throw new ExpressError('user already verified', 400);
    }

    await sendVerificationEmail(user.email, user);
    return res.json('email sent');
};

const sendVerificationEmail = async (email,user) => {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: User._id } , secret , { expiresIn: '120m' });

    let config = {
        host: 'smtp.hostinger.com', // Hostinger SMTP server
        port: 465, // Port for secure SMTP
        secure: true, // True for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // Hostinger email user
            pass: process.env.PASSWORD // Hostinger email password
        }
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Geek Clash',
            link: process.env.SITE_URL,
            copyright: 'Copyright © 2024 Geek Clash. All rights reserved.',
        },
        logo: 'https://res.cloudinary.com/dwnw77ubt/image/upload/v1720155961/fav_ky1c7f.png'

    });

    var response = {
        body: {
            name: `${user.username}`,
            intro: 'Thank you for registering on GeekClash. Please verify your email address by clicking on the link below:',
            action: {
                instructions: 'Click the button below to verify your email:',
                button: {
                    color: '#5cd7d1',
                    text: 'Continue to verification',
                    link: `${process.env.BACKEND_DOMAIN}/user/verifyEmail/${user._id}/${token}`
                }
            },

            outro: 'If you did not request a verification email, no further action is required on your part.'

        }
    };

    var emailBody = MailGenerator.generate(response);
    let message = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: 'Email Verification',
        html: emailBody
    };

    transporter.sendMail(message)
    .then(() => console.log('email sent'))
    .catch((err) => console.log(err));        
}


module.exports.verifyUser = async (req, res) => {
    const { userid, token } = req.params;
    const user = await User.findById(userid);

    if(!user){
        return res.status(400).json('user not found');
    }

    else{
        const secret = `${process.env.SECRET}`;
        if(jwt.verify(token,secret)){
            user.verified = true;
            await user.save();
            res.render('verifyEmail', {Link: process.env.SITE_URL});
        }
        else{
            return res.status(400).json('invalid token');
        }
    }
}








