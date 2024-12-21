const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    let config = {
        host: 'smtp.hostinger.com', // Hostinger SMTP server
        port: 465, // Port for secure SMTP
        secure: true, // True for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // Hostinger email user
            pass: process.env.PASSWORD // Hostinger email password
        }
    };
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport(config);
    // Send emails to users

    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: `${title}`, // subject
        html: body,
    };

    transporter.sendMail(mailOptions)
    .then(() => console.log('email sent'))
    .catch((err) => console.log(err));       

};

module.exports = mailSender;