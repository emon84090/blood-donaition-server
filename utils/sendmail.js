var nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.SMTPEMAIL,
        pass: process.env.SMTPASSWORD
    }

})
const mailsend = async (email, subject, token) => {
    var mailOptions = {
        from: '"DTI Blood Donaition" <admin@trustpointit.com>',
        to: email,
        subject: subject,
        text: `${token}`
    };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });



}





module.exports = mailsend;