const mongoose = require('mongoose');


const allDataschema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name must required"]
    },
    phonenumber: {
        type: String,
        required: [true, "phonenumber must required"]
    },
    bloodgroup: {
        type: String,
        required: [true, "bloodgroup must required"]
    },
    division: {
        type: String,
        required: [true, "division must required"]
    },
    batch: {
        type: String,
        required: [true, "batch must required"]
    },
    lastdate: {
        type: String,

    },
}, {
    timestamps: true
})

module.exports = mongoose.model("alldata", allDataschema);