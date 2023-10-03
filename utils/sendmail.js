var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'emon84090@gmail.com',
        pass: 'lultmorysucrqxez'
    }

})
const mailsend = (email, subject, token) => {
    var mailOptions = {
        from: '"DTI Blood Donaition" <admin@trustpointit.com>',
        to: email,
        subject: subject,
        text: `${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


module.exports = mailsend;