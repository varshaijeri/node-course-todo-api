const express = require('express');
const _ = require('lodash');
//converts json to js object
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

//inserting todos
app.post('/todos',(req,res)=>{
    var todo = new Todo({text:req.body.text});
    todo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });
});

//get all todos
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

//get individual todo
app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    //validate id
    if(!ObjectId.isValid(id)){
        //res-404-send back empty result
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});

//delete invidual todo item
app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});

//to update todo item for completing the todo
app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        //set completedAt to timestamp value
        body.completedAt = new Date().getTime();
    }else{
        //set completedAt to null
        body.completed = false;
        body.completedAt = null;
    }
    //save to database
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.listen(port,()=>{
    console.log(`Started Server on ${port}`);
});

module.exports = {app};
