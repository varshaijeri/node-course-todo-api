const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not valid email-id'
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

//overring toJSON to remove tokens password fields from the reponse,how a mongoose model gets converted to json
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObj = user.toObject();

    return _.pick(userObj,['_id','email']);
};

UserSchema.methods.getAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},"salt").toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}

//schema for Users collection
var User = mongoose.model('User',UserSchema);

module.exports = {
    User
};


//to create a collection create an instance of this model 
//and pass the required fields of document in constructor 
//function