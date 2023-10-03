const mongoose = require('mongoose');
require('dotenv').config();

const dbCOnnect = async () => {

    try {
        const data = await mongoose.connect(`mongodb+srv://DTIBLOOD:cCBv22WD0oVVz6zu@cluster0.dw47wnx.mongodb.net/dtiblood`);
        console.log(`database conected`);
    } catch (err) {
        console.log("not connected")
    }
}


module.exports = dbCOnnect;

