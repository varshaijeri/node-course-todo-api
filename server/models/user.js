const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//model method:returns user with passed token
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,"salt");
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
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

//mongoose middleware
UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

//schema for Users collection
var User = mongoose.model('User',UserSchema);

module.exports = {
    User
};


//to create a collection create an instance of this model 
//and pass the required fields of document in constructor 
//function