const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userToAdd = [{
    _id:userOneId,
    email:"varshaijeri@gmail.com",
    password:"userOnePass",
    tokens:[{
        access: 'auth',
        token:jwt.sign({_id:userOneId,access:'auth'},'salt').toString()
    }]
},{
    _id:userTwoId,
    email:"varshaijeri11@gmail.com",
    password:"userTwoPass",
    tokens:[{
        access: 'auth',
        token:jwt.sign({_id:userTwoId,access:'auth'},'salt').toString()
    }]
}]
const todosToAdd = [
    { text: "Get chickens", _id: new ObjectID(),_creator:userOneId },
    { text: "Get car", _id: new ObjectID() ,completed:true,completedAt:1234556,_creator:userTwoId}
];
//executes before your test case executes
const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todosToAdd);
    }).then(()=>done());
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(userToAdd[0]).save();
        var userTwo = new User(userToAdd[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(()=>done());
};

module.exports = {
    todosToAdd,
    populateTodos,
    userToAdd,
    populateUsers
}