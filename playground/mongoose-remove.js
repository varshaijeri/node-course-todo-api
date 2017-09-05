const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result)=>{
    console.log(result);
});

Todo.findByIdAndRemove({_id:"59ae6680feb281a8321712e9"}).then((result)=>{
    console.log(result);
});

Todo.findByIdAndRemove("59ae6680feb281a8321712e9").then((result)=>{
    console.log(result);
});