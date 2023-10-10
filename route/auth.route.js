const adminlist = require('../model/adminlist');
const errorhandle = require('../utils/errorhandle');
const { generateToken } = require('../utils/generatetoken');
const { verifyjwt } = require('../utils/verifyjwt');
const bcrypt = require('bcrypt');
const sendmail = require("../utils/sendmail");
const Router = require('express').Router();
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 3,
    message: "Too Many Request from This Ip Try Agin After 2 Minutes"

})



Router.post("/login", limiter, async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const useremail = await adminlist.findOne({ email: email })
        if (!useremail) {
            return errorhandle("email not registared", 401)
        }

        const isvalidPassword = useremail.comparePassword(password, useremail.password)

        if (!isvalidPassword) {

            return errorhandle("password not correct", 403)
        }

        const token = generateToken(useremail);

        res.status(200).json({
            status: true,
            message: "login success",
            token: token,
            data: useremail

        })

    } catch (err) {

        next(err)
    }

})

Router.get("/me", verifyjwt, async (req, res, next) => {

    try {
        const { email } = req.user;
        const result = await adminlist.findOne({ email: email }).select("-password");
        res.status(200).send({
            status: true,
            user: result
        })
    } catch (err) {
        next(err)
    }
})


Router.patch("/changepassword", limiter, verifyjwt, async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const useremail = await adminlist.findOne({ email: email });
        if (!useremail) {
            return errorhandle("email not registared", 401)
        }

        const hasedpassword = bcrypt.hashSync(password, 10)


        const result = await adminlist.updateOne({ email: email }, { $set: { password: hasedpassword } })
        if (!result.modifiedCount) {
            return errorhandle("password updated faild,try again", 400)
        }

        res.status(200).json({
            status: true,
            message: "password  uupdated success",

        })
    } catch (err) {
        next(err)
    }
})




Router.post("/forgetpassword", limiter, async (req, res, next) => {
    const { email } = req.query;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        if (!email) {
            return errorhandle("Email required", 400)
        }

        const getUsers = await adminlist.findOne({ email: email })
        if (!getUsers) {
            return errorhandle("Email Not Registared", 400)
        }

        const token = getUsers.passwordReset();

        sendmail(getUsers.email, "Password Reset Otp", token);

        await getUsers.save({ validateBeforeSave: false })

        await session.commitTransaction();
        session.endSession();


        res.status(200).send({
            status: true,
            message: "chek your email",

        })

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err)
    }
})




Router.patch("/resetpassword", limiter, async (req, res, next) => {

    try {

        const token = req.query.token;

        if (!token) {
            return errorhandle("Token required", 400)
        }
        const findToken = await adminlist.findOne({ passwordResetToken: token })

        if (!findToken) {
            return errorhandle("Invalid OTP", 400)
        }
        const expired = new Date() > new Date(findToken.passwordResetExpirise);
        if (expired) {
            return errorhandle("OTP Expired,Try again", 403)
        }

        const hash = bcrypt.hashSync(req.body.password, 10);


        const result = await adminlist.updateOne({ passwordResetToken: token }, { $set: { password: hash } });

        if (result.matchedCount) {
            findToken.passwordResetToken = "";

            await findToken.save({ validateBeforeSave: false })
            res.status(200).send({
                status: true,
                message: "password reset success",

            })

        }

    } catch (err) {
        next(err)
    }
})




module.exports = Router;