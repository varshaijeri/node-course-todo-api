//mangoose is mainly used for holding schema
const mongoose = require('mongoose');

//setting the promise
mongoose.Promise = global.Promise;

//connecting to mongodb database
mongoose.connect(process.env.MONGODB_URI);
//waits till its connected to the database

module.exports = {
    mongoose
};