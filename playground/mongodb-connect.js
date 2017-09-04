//const MongoClient = require('mongodb').MongoClient;
//destructuring object for mongodb
const {MongoClient} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server");
    }
    console.log("Database is connected");
    //create a Todos collection
    // db.collection('Todos').insertOne({
    //     text:"1st data insert",
    //     completed:false
    // },(err,result)=> {
    //     if(err){
    //         return console.log("Unable to insert the data",err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    //create a Users collection
    db.collection('Users').insertOne({
        name:"Varsha",
        age:23,
        location:"Bangalore"
    },(err,result)=>{
        if(err){
            return console.log("Unable to insert the data",err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
    db.close();
})