const mongoose = require('mongoose');
//schema for Users collection
var User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1
    }
});

module.exports = {
    User
};


//to create a collection create an instance of this model 
//and pass the required fields of document in constructor 
//function