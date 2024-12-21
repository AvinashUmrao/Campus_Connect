const User = require('./models/userModel')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const isClient = async (req, res, next) => {
    const cookie = req.signedCookies.userjwt;

    if (!cookie) {
        return res.status(401).json("Not Logged In");
    }
    try {
        const token = cookie.token;
        const expiresIn = cookie.expiresIn;
        // console.log(token, expiresIn);
        const decoded = jwt.verify(token, process.env.USER_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("Unauthorized");
        }
        req.userId = user.id;
        req.expIn = expiresIn;
        next();
    }
    catch (e) {
        return res.status(401).json("Unauthorized");
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: 600 * 1024 }, // 600KB
  });

module.exports = {  isClient, upload };
