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

    const success = await new Promise((resolve, reject) => {

        transporter.sendMail(mailOptions).then((info, err) => {
            if (info.response.includes('250')) {
                resolve(true)
            }
            reject(err)
        })
    })

    if (!success) {
        res.status(500).json({ error: 'Error sending email' })
    }



}





module.exports = mailsend;