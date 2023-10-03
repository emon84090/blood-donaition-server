const adminlist = require('../model/adminlist');
const errorhandle = require('../utils/errorhandle');
const { verifyjwt } = require('../utils/verifyjwt');


const Router = require('express').Router();

Router.post("/", verifyjwt, async (req, res, next) => {
    try {
        const existEmail = await adminlist.findOne({ email: req.body.email })

        if (existEmail) {
            return errorhandle("email already registared,try another", 400)
        }

        const response = await adminlist.create(req.body);

        res.status(200).json({
            status: "true",
            message: "Admin Added Successfully"
        })
    } catch (err) {
        next(err)
    }
})
Router.get("/", verifyjwt, async (req, res, next) => {
    try {
        const data = await adminlist.find({}).select("-password");
        res.status(200).json({
            status: true,
            data: data
        })
    } catch (err) {
        next(err)
    }
})



Router.delete("/:id", verifyjwt, async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await adminlist.deleteOne({ _id: id });
        if (!result.deletedCount) {
            return errorhandle("data deleted faild,try again", 400)
        }
        res.status(200).json({
            status: true,
            message: "data deleted success"
        })

    } catch (err) {
        next(err)
    }
})


module.exports = Router;