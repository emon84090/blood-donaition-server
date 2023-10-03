const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const adminlistScema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name must required"]
    },
    phonenumber: {
        type: String,
        required: [true, "phonenumber must required"]
    },
    batch: {
        type: String,
        required: [true, "batch must required"]
    },
    email: {
        type: String,
        required: [true, "email must required"]
    },

    password: {
        type: String,
        required: [true, "password must required"]
    },
    passwordResetToken: String,
    passwordResetExpirise: Date

}, {
    timestamps: true
})


adminlistScema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    const password = this.password;
    const hasedpassword = bcrypt.hashSync(password, 10)
    this.password = hasedpassword;
    next()
})




adminlistScema.methods.comparePassword = function (password, hash) {

    const isvalidPassword = bcrypt.compareSync(password, hash);

    return isvalidPassword;
}

adminlistScema.methods.passwordReset = function () {
    const token = crypto.randomBytes(4).toString('hex');
    this.passwordResetToken = token;
    let date = new Date();
    date.setDate(date.getDate() + 1);

    this.passwordResetExpirise = date;

    return token
}

module.exports = mongoose.model("adminlist", adminlistScema);