const {User} = require('./../models/user');

//middleware definition
var authenticate = (req,res,next)=>{
    //grab token
    var token = req.header('x-auth');
    //get the user
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send();
    });
};

module.exports = {
    authenticate
}