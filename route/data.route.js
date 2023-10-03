const express = require('express');
const datalist = require('../model/datalist');
const errorhandle = require('../utils/errorhandle');
const Router = express.Router();
const { verifyjwt } = require('../utils/verifyjwt');


Router.get("/", async (req, res, next) => {


    let filterQuery = { ...req.query };

    const othersFilter = ["skip", "limit", "page", "filter"];
    othersFilter.forEach((val) => delete filterQuery[val]);

    if (filterQuery.division === "All") {
        delete filterQuery.division
    }

    if (req.query.filter) {

        filterQuery.bloodgroup = { $in: JSON.parse(req.query.filter) }
    }



    const queries = {};

    if (req.query.page) {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);
    }


    try {

        const result = await datalist.find(filterQuery)
            .sort("-createdAt")
            .skip(queries.skip)
            .limit(queries.limit)


        const totalData = await datalist.countDocuments(filterQuery);

        const page = Math.ceil(totalData / queries.limit);

        res.status(200).json({
            data: result,
            page: page
        })


    } catch (err) {
        next(err)
    }
})

Router.post("/", async (req, res, next) => {

    try {
        const existPhone = await datalist.findOne({ phonenumber: req.body.phonenumber })

        if (existPhone) {
            return errorhandle("Phone Number Already Taken", 400)
        }


        const result = await datalist.create(req.body)
        if (result) {
            res.status(200).json({
                status: "success",
                message: "Data Saved Succesfully"
            })
        }

    } catch (err) {
        next(err)
    }
})



Router.patch("/updatedate", verifyjwt, async (req, res, next) => {

    const { phonenumber } = req.body;
    try {
        const existPhone = await datalist.findOne({ phonenumber: phonenumber })

        if (!existPhone) {
            return errorhandle("Phone Number Not Registared", 400)
        }
        const result = await datalist.updateOne({ phonenumber: phonenumber }, { $set: { lastdate: req.body.updatedate } })
        if (!result.modifiedCount) {
            return errorhandle("data updated faild,try again", 400)
        }

        res.status(200).json({
            status: true,
            message: "date updated success"
        })

    } catch (err) {
        next(err)
    }
})

Router.patch("/:id", verifyjwt, async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await datalist.updateOne({ _id: id }, { $set: req.body })
        if (!result.modifiedCount) {
            return errorhandle("data updated faild,try again", 400)
        }

        res.status(200).json({
            status: true,
            message: "data updated success"
        })

    } catch (err) {
        next(err)
    }
})


Router.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await datalist.findOne({ _id: id });
        if (!result) {
            return errorhandle("invalid id", 400)
        }
        res.status(200).json({
            status: true,
            data: result
        })

    } catch (err) {
        next(err)
    }
})

Router.delete("/:id", verifyjwt, async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await datalist.deleteOne({ _id: id });
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