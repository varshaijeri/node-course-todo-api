const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59ae27adb90acd4478b4c95b11';

//to validate ObjectId
if(!ObjectID.isValid(id)){
    return console.log("Id is not valis")
}
Todo.find({
    _id:id
}).then((todos)=>{
    console.log('Todos',todos);
});

//simply grabs the 1st match document
Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log('Todos',todo);
});

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log("Id not found")
    }
    console.log('Todos',todo);
}).catch(((e)=>console.log(e)));

//query for users collection
var user = new User({email:"mtatachar@broadsoft.com"});
user.save().then((insertedUser)=>{
    User.findById(insertedUser._id).then((user)=>{
        if(!user){
            return console.log("Id not found");
        }
        console.log("User",user)
    }).catch((e)=>console.log(e));
})